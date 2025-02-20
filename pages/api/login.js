import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcrypt";

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

    req.session = {
      user: {
        userId: user._id,
        fullName: user.fullName,
        isVerified: user.isVerified,
      },
    };

    res.setHeader(
      "Set-Cookie",
      `session=${JSON.stringify(req.session.user)}; Path=/; HttpOnly; Max-Age=${24 * 60 * 60}`
    );

    return res.status(200).json({ success: true, message: "Login successful", isVerified: user.isVerified });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
