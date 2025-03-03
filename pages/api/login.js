import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import cookie from "cookie";
import redis from '../../utils/redis'

const MAX_SESSION_TIME = 6 * 60 * 60 * 1000;


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) { 
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const now = new Date();

    const cookies = cookie.parse(req.headers.cookie || '');
    const existingSessionToken = cookies.sessionToken;

    if (existingSessionToken) {
      
      await redis.del(`session:${existingSessionToken}`);

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("sessionToken", "", {
          httpOnly: true,
          secure: true, 
          sameSite: "lax",
          path: "/",
          expires: new Date(0),
        })
      );
    }

    // Create a new session
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + MAX_SESSION_TIME);

    const sessionData = {
      userId: {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone, 
        isVerified: user.isVerified,
         
      },
      sessionToken,
      expiresAt,
      isLoggedIn: true,
      lastActivity: now,
    }; 

    // Store session in Redis
    await redis.set(`session:${sessionToken}`, JSON.stringify(sessionData), { ex: MAX_SESSION_TIME / 1000 });

    // Set the session token in the cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
        path: "/",
        maxAge: MAX_SESSION_TIME / 1000, 
      })
    );

    return res.status(200).json({ success: true, message: "Login successful", isVerified: user.isVerified });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

