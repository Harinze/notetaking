import { NextResponse } from "next/server";
import User from "../../models/User";
import connectToDB from "../../lib/connectToDB";


export async function POST(req) {
  try {
    await connectToDB()

    const { fullName, email, password, country, phone } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Full Name, Email, and Password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const newUser = await User.create({ fullName, email, password, country, phone });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

