"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { normalizePhone } from "@/helper/phone";
import OtpInputs from "../modules/OtpInputs";
//icons
import { CiUser, CiMobile1 } from "react-icons/ci";
import SignUpBtn from "../elements/SignUpBtn";

// کامپوننت اصلی
function SignUpContent() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      toast.error("برای ادامه باید وارد شوید یا ثبت نام کنید");
    }
  }, [searchParams]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone), name }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("کد ارسال شد");
        setStep(2);
      } else toast.error(json.message);
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
        toast.success("ثبت‌نام موفق");
        if (json.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/client");
        }
      } else toast.error(json.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full flex flex-col gap-2 max-w-md p-6 rounded">
        {step === 1 && (
          <>
            <h3 className="mb-4 font-bold text-2xl text-center">فرم ثبت‌نام</h3>

            <div className="flex flex-col gap-1 w-full border-gray-300 border-2 rounded-md p-1">
              <div className="flex justify-between items-center">
                <CiUser size={30} />
                <div className="w-0.5 h-10 rounded-md bg-gray-100"></div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className="w-xs p-2 rounded  text-white font-bold "
                />
                <span className="font-bold text-gray-500 ml-2 opacity-0">
                  +98
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full border-gray-300 border-2 rounded-md p-1">
              <div className="flex justify-between items-center">
                <CiMobile1 size={30} />
                <div className="w-0.5 h-10 rounded-md bg-gray-100"></div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="شماره تلفن"
                  className="w-xs p-2 rounded  text-white font-bold tracking-[3px]"
                />
                <span className="font-bold text-withe ml-2">+98</span>
              </div>
            </div>
            <SignUpBtn onClick={sendOtp} loading={loading} />
          </>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="mb-4 font-bold text-2xl text-gray-500 text-center">
              کد تایید
            </h3>
            <OtpInputs value={otp} onChange={setOtp} />
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="py-2 bg-green-600 text-white w-full rounded"
              >
                تایید
              </button>
              <button
                onClick={() => setStep(1)}
                className="py-2 bg-gray-200 font-bold text-gray-500 rounded w-full"
              >
                بازگشت
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت اصلی با Suspense
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
