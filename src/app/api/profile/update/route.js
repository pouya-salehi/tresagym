// src/app/api/profile/update/route.js
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
    if (!user)
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

    const { gender, height, weight, description, idNumber } = await req.json();

    let profile;
    if (user.isApproved) {
      profile = await Profile.findById(user.isApproved);
      profile.idNumber = idNumber;
      profile.gender = gender;
      profile.height = height;
      profile.weight = weight;
      profile.description = description;
      profile.status = "pending"; // وقتی آپدیت می‌کنه دوباره pending میشه
    } else {
      profile = new Profile({
        user: user._id,
        gender,
        height,
        weight,
        description,
        idNumber,
      });
      user.isApproved = profile._id;
    }

    await profile.save();
    await user.save();

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
