import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { otp, password } = req.body;

  if (!otp || !password) {
    return res.status(400).json({ error: "OTP and password are required" });
  }

  try {
    await connectToDB();

    const user = await User.findOne({ resetToken: otp, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
