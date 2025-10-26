import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getUserFromToken } from "@/utils/getUserFormToken";

export async function POST(req) {
  try {
    await connectDB();
    const payload = await getUserFromToken(req);
    if (!payload)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const user = await User.findById(payload.sub);
    if (!user || !user.isApproved)
      return NextResponse.json(
        { message: "پروفایل یافت نشد" },
        { status: 404 }
      );

    const { bmi } = await req.json();
    if (!bmi || isNaN(bmi))
      return NextResponse.json({ message: "BMI نامعتبر" }, { status: 400 });

    const profile = await Profile.findById(user.isApproved);
    profile.bmi = bmi;
    profile.analyzed = true;
    await profile.save();

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
