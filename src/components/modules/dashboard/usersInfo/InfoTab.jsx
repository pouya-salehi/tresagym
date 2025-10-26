"use client";
import { useState, useEffect } from "react";
import {
  User,
  Activity,
  Ruler,
  Weight,
  CheckCircle,
  Loader,
  AlertCircle,
} from "lucide-react";

export default function InfoTab({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching profile for user:", user.user._id);

        const response = await fetch(`/api/profile/${user.user._id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "خطا در دریافت اطلاعات پروفایل");
        }

        const data = await response.json();
        console.log("Profile API response:", data);

        if (data.status === "success") {
          setProfile(data.data.profile);
        } else {
          throw new Error(data.message || "خطا در دریافت اطلاعات");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user?._id) {
      fetchProfile();
    } else {
      setError("شناسه کاربر معتبر نیست");
      setLoading(false);
    }
  }, [user]);

  // اگر پروفایل خالی باشه، نمونه‌ای نمایش بده
  const displayProfile = profile || {
    gender: "male",
    height: null,
    weight: null,
    idNumber: "---",
    description: "",
    analyzed: false,
    status: "pending",
    program: [],
    bmi: null,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-700/50 rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-gray-700/50 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getBMICategory = (bmi) => {
    if (!bmi) return "---";
    if (bmi < 18.5) return `${bmi} (کمبود وزن)`;
    if (bmi < 25) return `${bmi} (نرمال)`;
    if (bmi < 30) return `${bmi} (اضافه وزن)`;
    return `${bmi} (چاقی)`;
  };

  const getGenderText = (gender) => {
    return gender === "male" ? "مرد 👨" : gender === "female" ? "زن 👩" : "---";
  };

  return (
    <div className="space-y-6">
      {/* نمایش خطا */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<User className="w-6 h-6" />}
          title="اطلاعات شخصی"
          items={[
            { label: "نام کامل", value: user.user?.name || "---" },
            { label: "شماره تماس", value: user.user?.phone || "---" },
            { label: "ایمیل", value: user.user?.email || "---" },
            { label: "کد ملی", value: displayProfile.idNumber || "---" },
          ]}
          color="blue"
        />

        <InfoCard
          icon={<Activity className="w-6 h-6" />}
          title="مشخصات فیزیکی"
          items={[
            {
              label: "جنسیت",
              value: getGenderText(displayProfile.gender),
            },
            {
              label: "قد",
              value: displayProfile.height
                ? `${displayProfile.height} cm`
                : "---",
              icon: <Ruler className="w-4 h-4" />,
            },
            {
              label: "وزن",
              value: displayProfile.weight
                ? `${displayProfile.weight} kg`
                : "---",
              icon: <Weight className="w-4 h-4" />,
            },
            {
              label: "BMI",
              value: getBMICategory(displayProfile.bmi),
              color: displayProfile.bmi
                ? displayProfile.bmi < 18.5
                  ? "text-yellow-400"
                  : displayProfile.bmi < 25
                  ? "text-green-400"
                  : displayProfile.bmi < 30
                  ? "text-orange-400"
                  : "text-red-400"
                : "text-gray-300",
            },
          ]}
          color="green"
        />
      </div>

      {/* کارت وضعیت */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          وضعیت حساب
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusItem
            label="وضعیت پروفایل"
            value={
              displayProfile.status === "accepted"
                ? "تأیید شده ✅"
                : displayProfile.status === "pending"
                ? "در انتظار تأیید ⏳"
                : "رد شده ❌"
            }
            color={
              displayProfile.status === "accepted"
                ? "green"
                : displayProfile.status === "pending"
                ? "yellow"
                : "red"
            }
          />
          <StatusItem
            label="تاریخ ثبت‌نام"
            value={
              user.user?.createdAt
                ? new Date(user.user.createdAt).toLocaleDateString("fa-IR")
                : "---"
            }
          />
          <StatusItem
            label="آنالیز شده"
            value={displayProfile.analyzed ? "بله ✅" : "خیر ❌"}
            color={displayProfile.analyzed ? "green" : "red"}
          />
          <StatusItem
            label="برنامه فعال"
            value={displayProfile.program?.length > 0 ? "دارد 📋" : "ندارد"}
            color={displayProfile.program?.length > 0 ? "green" : "gray"}
          />
        </div>
      </div>

      {/* کارت توضیحات */}
      {displayProfile.description && (
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-bold text-white mb-3">توضیحات کاربر</h3>
          <p className="text-gray-300 leading-relaxed">
            {displayProfile.description}
          </p>
        </div>
      )}

      {/* کارت اقدامات */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4">اقدامات</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            onClick={async () => {
              try {
                const response = await fetch(`/api/profile/${user.user._id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ action: "accept" }),
                });

                if (response.ok) {
                  // رفرش اطلاعات
                  window.location.reload();
                }
              } catch (error) {
                console.error("Error accepting profile:", error);
              }
            }}
          >
            <CheckCircle className="w-4 h-4" />
            تأیید پروفایل
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" />
            محاسبه BMI
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
            <User className="w-4 h-4" />
            ویرایش اطلاعات
          </button>
        </div>
      </div>

      {/* اطلاعات دیباگ */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-600">
          <h4 className="text-sm font-bold text-gray-400 mb-2">
            اطلاعات دیباگ:
          </h4>
          <pre className="text-xs text-gray-500 overflow-auto">
            {JSON.stringify(
              {
                userId: user.user._id,
                profile: displayProfile,
                hasHeight: !!displayProfile.height,
                hasWeight: !!displayProfile.weight,
                bmi: displayProfile.bmi,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

// کامپوننت‌های کمکی InfoTab (همون قبلی)
function InfoCard({ icon, title, items, color = "blue" }) {
  const colorClasses = {
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    purple: "border-purple-500/20",
    amber: "border-amber-500/20",
  };

  return (
    <div
      className={`bg-gray-800/50 rounded-2xl p-6 border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-700 rounded-xl">{icon}</div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
          >
            <span className="text-gray-400 text-sm">{item.label}</span>
            <span
              className={`font-medium flex items-center gap-2 ${
                item.color || "text-white"
              }`}
            >
              {item.icon}
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusItem({ label, value, color = "gray" }) {
  const colorClasses = {
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    gray: "text-gray-300",
  };

  return (
    <div className="text-center">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}
