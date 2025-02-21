import User from "../../models/User";
import Session from "../../models/Session";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import cookie from "cookie";

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

    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + MAX_SESSION_TIME);

    await Session.create({
      userId: user._id,
      sessionToken,
      expiresAt,
      lastActivity: now
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sessionToken", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: MAX_SESSION_TIME,
      })
    );

    return res.status(200).json({ success: true, message: "Login successful", isVerified: user.isVerified });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

