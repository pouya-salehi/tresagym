import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import { getUserFromToken } from "@/utils/getUserFormToken";

export async function GET(req) {
  try {
    await connectDB();
    const admin = await getUserFromToken(req);

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const count = await Profile.countDocuments({ status: "pending" });

    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
