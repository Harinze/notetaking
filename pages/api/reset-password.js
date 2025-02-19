import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import crypto from "crypto";
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Custom SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.INFO_EMAIL_HOST, // Your custom SMTP host
      port: 465, // Use 465 for SSL or 587 for TLS
      secure: true, // True for 465, false for 587
      auth: {
        user: process.env.INFO_EMAIL, // SMTP Username
        pass: process.env.INFO_EMAIL_PASSWORD, // SMTP Password
      },
      tls: {
        rejectUnauthorized: false, // Change to true if your certificate is valid
      },
    });

    // Send Reset Email
    const resetURL = `https://notetaking-two.vercel.app/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"Support Team" <${process.env.INFO_EMAIL}>`, // Display Name + Email
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
