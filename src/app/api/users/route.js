import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getUserFromToken } from "@/utils/getUserFormToken";

export async function GET(req) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const approvedProfiles = await Profile.find({ status: "accepted" })
      .populate("user", "name phone")
      .select("gender height weight bmi user");

    return NextResponse.json({ success: true, data: approvedProfiles });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
