import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    // Configure SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Note Master" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1e40af;">Password Reset Request</h2>
            <p style="color: #6b7280;">Use the OTP below to reset your password. This OTP is valid for 1 hour.</p>
            <div style="font-size: 24px; font-weight: bold; color: #1e40af; background: #f1f5f9; padding: 10px; display: inline-block; border-radius: 4px;">${otp}</div>
            <p style="color: #6b7280; margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
