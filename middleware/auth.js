import connectToDB from "../lib/connectToDB";
import Session from "../models/Session";
import cookie from "cookie";

const MAX_SESSION_TIME = 6 * 60 * 60 * 1000; 
const MAX_INACTIVITY_TIME = 1 * 60 * 60 * 1000;
// const MAX_INACTIVITY_TIME = 2 * 60 * 1000;


export async function withAuth(req, res, next) {
  await connectToDB();

  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionToken = cookies.sessionToken;

  if (!sessionToken) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const session = await Session.findOne({ sessionToken }).populate("userId", "-password");

  if (!session) {
    return res.status(401).json({ error: "Invalid session. Please log in again." });
  }

  const now = new Date();
  const timeSinceLastActivity = now - session.lastActivity;

  if (timeSinceLastActivity > MAX_INACTIVITY_TIME) {
    await Session.deleteOne({ sessionToken });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      })
    );

    return res.status(401).json({ error: "Session expired due to inactivity. Please log in again." });
  }

  if (session.expiresAt < now) {
    await Session.deleteOne({ sessionToken });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      })
    );

    return res.status(401).json({ error: "Session expired. Please log in again." });
  }

  session.lastActivity = now;
  session.expiresAt = new Date(now.getTime() + MAX_SESSION_TIME);
  await session.save();

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_SESSION_TIME / 1000, 
    })
  );

  req.user = {
    userId: session.userId._id,
    fullName: session.userId.fullName,
   //  email: session.userId.email,
    // isVerified: session.userId.isVerified,
    // createdAt: session.userId.createdAt,
  };

  next();
}
