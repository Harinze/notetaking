import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { otp, password } = req.body;

  console.log("Received OTP:", otp);
  console.log("Received Password:", password);

  if (!otp || !password) {
    return res.status(400).json({ error: "OTP and password are required" });
  }

  // Validate password: At least 8 characters, 1 letter, 1 number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long, with at least 1 letter and 1 number.",
    });
  }

  try {
    await connectToDB();

    // Find user with valid OTP
    const user = await User.findOne({
      resetToken: otp,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (!hashedPassword) {
      throw new Error("Password hashing failed");
    }

    // Update user data
    user.password = hashedPassword;
    user.isVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the user
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
