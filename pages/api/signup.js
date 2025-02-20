import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const { fullName, email, country, phone } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: "Full Name, Email, and Password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Create new user with OTP
    const newUser = await User.create({
      fullName,
      email,
      country,
      phone,
      resetToken: otp,
      resetTokenExpiry: otpExpires,
      
    });

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    return res.status(201).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASSWORD,
       },
     });

     const mailOptions = {
      from: `"Note Master" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code - Password Reset",
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
}
