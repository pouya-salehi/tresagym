// src/app/api/users/[userId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = params;
    if (!userId) return NextResponse.json({ user: null }, { status: 400 });

    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ status: "failed" }, { status: 404 });

    return NextResponse.json(
      { status: "success", data: user },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "failed", message: "مشکلی در سرور رخ داد" },
      { status: 500 }
    );
  }
}
