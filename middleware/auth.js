import redis from "../utils/redis";
import cookie from "cookie";

const MAX_SESSION_TIME = 6 * 60 * 60 * 1000; 
const MAX_INACTIVITY_TIME = 1 * 60 * 60 * 1000; 

export async function withAuth(req, res) {
  try {

    const cookies = cookie.parse(req.headers.cookie || "");
    const sessionToken = cookies.sessionToken;

    if (!sessionToken) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    // 🔹 Retrieve session data from Redis
    const sessionData = await redis.get(`session:${sessionToken}`);

    if (!sessionData) {
      return res.status(401).json({ success: false, message: "Invalid session. Please log in again." });
    }

    let session;
    try {
      session = typeof sessionData === "string" ? JSON.parse(sessionData) : sessionData;
    } catch (err) {
      console.error("❌ Failed to parse session data:", err, "Raw Data:", sessionData);
      return res.status(500).json({ success: false, message: "Session data corrupted. Please log in again." });
    }

    const now = Date.now();
    const timeSinceLastActivity = now - session.lastActivity;

    // 🔹 Handle expired sessions
    if (timeSinceLastActivity > MAX_INACTIVITY_TIME || session.expiresAt < now) {
      const pipeline = redis.pipeline();
      pipeline.del(`session:${sessionToken}`);
      pipeline.exec();

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("sessionToken", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 0,
        })
      );

      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    session.lastActivity = now;
    session.expiresAt = now + MAX_SESSION_TIME;

    await redis.set(`session:${sessionToken}`, JSON.stringify(session), { ex: MAX_SESSION_TIME / 1000 });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: MAX_SESSION_TIME / 1000,
      })
    );

    console.log("\x1b[36m[SERVER LOG] >>>\x1b[32m Session Updated! \x1b[33m🔄 ✅\x1b[0m");

    return {
      ...req,
      user: {
        userId: session.userId._id,
        fullName: session.userId.fullName,
        email: session.userId.email,
        phone: session.userId.phoneNumber,
        isVerified: session.userId.isVerified,
        isLoggedIn: true,
       
      },
    };
  } catch (error) {
    console.error("❌ withAuth Error:", error);
    return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
  }
}
