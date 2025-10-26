import { NextResponse } from "next/server";
//utils
import connectDB from "@/utils/connectDB";
//helper
import { normalizePhone } from "@/helper/phone";
//model
import User from "@/models/User";
export async function POST(req) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json(
      { status: "failed", message: "DB error" },
      { status: 500 }
    );
  }

  const { phone: rawPhone, name } = await req.json();
  const phone = normalizePhone(rawPhone);

  if (!/^09\d{9}$/.test(phone)) {
    return NextResponse.json(
      { status: "failed", message: "شماره موبایل نامعتبر" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = new Date(Date.now() + 2 * 60 * 1000);

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone, name: name || "", otp, otpExpire });
  } else {
    user.otp = otp;
    user.otpExpire = otpExpire;
  }
  await user.save();

  // ارسال کد با Kavenegar Verify Lookup
  try {
    const apiKey = process.env.KAVENEGAR_API_KEY;

    // 🔹 در حالت تست فقط به شماره‌ای که توی پنل ثبت کردی ارسال میشه
    const receptor = "09186570345";

    const url =
      `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json` +
      `?receptor=${receptor}&token=${otp}&template=cooperify`;

    const response = await fetch(url);
    const json = await response.json();
    console.log("Kavenegar response:", json);

    if (json.return && json.return.status === 200) {
      return NextResponse.json(
        { status: "success", message: "کد ارسال شد" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "failed",
          message: json.return?.message || "ارسال پیامک انجام نشد",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("kavenegar send error", err);
    return NextResponse.json(
      { status: "failed", message: "خطا در ارسال پیامک" },
      { status: 500 }
    );
  }
}
