// src/app/api/auth/verify-otp/route.js
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
//model
import User from "@/models/User";
//utils
import connectDB from "@/utils/connectDB";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export async function POST(req) {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connect error:", err);
    return NextResponse.json(
      { status: "failed", message: "DB error" },
      { status: 500 }
    );
  }

  const { phone: rawPhone, otp } = await req.json();
  if (!rawPhone || !otp) {
    return NextResponse.json(
      { status: "failed", message: "phone and otp required" },
      { status: 400 }
    );
  }

  const phone = rawPhone.replace(/\s+/g, "");
  const user = await User.findOne({ phone });
  if (!user) {
    return NextResponse.json(
      { status: "failed", message: "کاربر یافت نشد" },
      { status: 404 }
    );
  }

  if (!user.otp || !user.otpExpire || new Date() > user.otpExpire) {
    return NextResponse.json(
      { status: "failed", message: "کد منقضی شده" },
      { status: 400 }
    );
  }

  if (user.otp !== String(otp)) {
    return NextResponse.json(
      { status: "failed", message: "کد اشتباه است" },
      { status: 400 }
    );
  }

  // پاک کردن OTP
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  // ✅ ایجاد JWT با jose
  const payload = {
    sub: user._id.toString(),
    phone: user.phone,
    role: (user.role || "USER").toUpperCase(),
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  console.log("✅ JWT payload:", payload);

  const res = NextResponse.json(
    {
      status: "success",
      message: "ورود موفق",
      user: { id: user._id, phone: user.phone, role: payload.role },
    },
    { status: 200 }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 روز
  });

  return res;
}
