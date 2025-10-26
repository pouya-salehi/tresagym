import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user)
      return NextResponse.json({ message: "user not found" }, { status: 404 });

    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = await Profile.create({ user: user._id });
    }

    return NextResponse.json({ user, profile }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
