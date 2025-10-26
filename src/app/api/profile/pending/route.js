import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import { getUserFromToken } from "@/utils/getUserFormToken";

export async function GET(req) {
  try {
    await connectDB();
    const payload = await getUserFromToken(req);
    if (!payload || payload.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const pendingProfiles = await Profile.find({ status: "pending" })
      .populate("user", "name phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: pendingProfiles },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
