import { NextResponse } from "next/server";
import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";
import bcrypt from "bcryptjs";


export async function POST(req) {
  try {
   await connectToDB()

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
