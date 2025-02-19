import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    if (!user.resetToken || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, user.resetToken);
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
}
