import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getUserFromToken } from "@/utils/getUserFormToken";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params; // تغییر از userId به id

    console.log("Fetching profile for user ID:", id);

    // اگر مربی هستی، پروفایل شاگرد رو ببین
    let query = {};
    if (user.role === "ADMIN" && id) {
      query.user = id;
    } else {
      query.user = user.sub;
    }

    const profile = await Profile.findOne(query)
      .populate("user", "name email phone createdAt")
      .lean();

    if (!profile) {
      console.log("Profile not found for query:", query);
      return NextResponse.json(
        { status: "failed", message: "پروفایل یافت نشد" },
        { status: 404 }
      );
    }

    // محاسبه BMI اگر height و weight موجود باشد
    let bmi = null;
    if (profile.height && profile.weight) {
      const heightInMeter = profile.height / 100;
      bmi = (profile.weight / (heightInMeter * heightInMeter)).toFixed(1);
    }

    console.log("Profile found:", {
      height: profile.height,
      weight: profile.weight,
      bmi,
    });

    return NextResponse.json({
      status: "success",
      data: {
        profile: {
          ...profile,
          bmi,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { status: "failed", message: "خطا در دریافت پروفایل" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const payload = await getUserFromToken(req);
    if (!payload || payload.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { id } = params;
    const { action } = await req.json();
    const profile = await Profile.findById(id);
    if (!profile)
      return NextResponse.json(
        { message: "پروفایل یافت نشد" },
        { status: 404 }
      );

    const user = await User.findById(profile.user);

    if (action === "accept") {
      profile.status = "accepted";
      await profile.save();
      user.isApproved = profile._id;
      await user.save();
    } else if (action === "delete") {
      profile.status = "rejected";
      await profile.save();
      user.isApproved = null;
      await user.save();
    } else {
      return NextResponse.json({ message: "Action نامعتبر" }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "خطا در سرور" },
      { status: 500 }
    );
  }
}
