"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
//helper
import { normalizePhone } from "@/helper/phone";
//components
import SignInBtn from "../elements/SignInBtn";
import OtpInputs from "../modules/OtpInputs";
//icons
import { CiMobile1 } from "react-icons/ci";

export default function SignInPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("کد ارسال شد");
        setStep(2);
      } else {
        toast.error(json.message || "خطا در ارسال کد");
      }
    } catch {
      toast.error("خطا در ارسال");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone), otp }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("با موفقیت وارد شدید");
        // 👇 نقش کاربر بر اساس JWT که توی کوکی ذخیره شد
        if (json.user.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/client");
        }
      } else {
        toast.error(json.message || "کد اشتباه است");
      }
    } catch {
      toast.error("خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-6 rounded">
        {step === 1 && (
          <>
            <h3 className="mb-4 font-bold text-center text-lg">
              ورود با شماره موبایل
            </h3>
            <div className="flex flex-col gap-1 w-full border-gray-300 border-2 rounded-md p-1">
              <div className="flex justify-between items-center">
                <CiMobile1 size={30} />
                <div className="w-0.5 h-10 rounded-md bg-gray-100"></div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="شماره تلفن"
                  className="w-xs p-2 rounded  white font-bold tracking-[3px]"
                />
                <span className="font-bold text-gray-500 ml-2">+98</span>
              </div>
            </div>
            <SignInBtn phone={phone} loading={loading} onClick={sendOtp} />
          </>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="mb-4 font-bold text-lg text-center text-gray-500">
              کد ۶ رقمی را وارد کنید
            </h3>
            <OtpInputs value={otp} onChange={setOtp} />
            <div className="flex gap-2">
              <button
                onClick={verifyOtp}
                disabled={loading || !otp}
                className="flex-1 py-2 bg-green-600 font-bold text-white rounded"
              >
                تایید کد
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 bg-gray-200 font-bold text-gray-500 rounded"
              >
                بازگشت
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}