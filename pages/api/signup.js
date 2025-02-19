import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const { fullName, email, password, country, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full Name, Email, and Password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      country,
      phone,
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
