"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Check,
  Trash,
  User,
  Phone,
  Clock,
  Users,
  Search,
  Filter,
  Loader,
} from "lucide-react";

export default function Register() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile/pending");
      const data = await res.json();
      if (data.success) setProfiles(data.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(
          action === "accept"
            ? "✅ کاربر با موفقیت تایید شد"
            : "❌ کاربر رد شد",
          {
            duration: 4000,
            icon: action === "accept" ? "✅" : "❌",
          }
        );
        fetchPendings();
      } else {
        toast.error("❌ عملیات انجام نشد!");
      }
    } catch (err) {
      console.error(err);
      toast.error("🚨 خطا در ارتباط با سرور!");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPendings();
  }, []);

  // فیلتر کردن بر اساس جستجو
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.user?.phone?.includes(searchTerm)
  );

  const stats = {
    total: profiles.length,
    pending: profiles.filter((p) => p.status === "pending").length,
  };

  return (
    <div className="min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />

      {/* هدر */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              مدیریت کاربران
            </h1>
            <p className="text-gray-400 mt-2">کاربران در انتظار تایید هویت</p>
          </div>

          {/* آمار */}
          <div className="flex gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 min-w-[120px]">
              <div className="text-cyan-400 text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-gray-400 text-sm">کل درخواست‌ها</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 min-w-[120px]">
              <div className="text-amber-400 text-2xl font-bold">
                {stats.pending}
              </div>
              <div className="text-amber-400 text-sm">در انتظار</div>
            </div>
          </div>
        </div>

        {/* جستجو و فیلتر */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا شماره تماس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl py-3 px-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span>{filteredProfiles.length} مورد یافت شد</span>
            </div>
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <div className="text-gray-400">در حال دریافت اطلاعات...</div>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-20 h-20 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                {searchTerm
                  ? "نتیجه‌ای یافت نشد"
                  : "هیچ کاربری در انتظار تایید نیست"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "لطفاً عبارت جستجو را تغییر دهید"
                  : "همه درخواست‌ها بررسی شده‌اند"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700/50 border-b border-gray-600">
                    <th className="py-4 px-6 text-right text-gray-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        اطلاعات کاربر
                      </div>
                    </th>
                    <th className="py-4 px-6 text-right text-gray-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        تماس
                      </div>
                    </th>
                    <th className="py-4 px-6 text-right text-gray-300 font-semibold">
                      وضعیت
                    </th>
                    <th className="py-4 px-6 text-right text-gray-300 font-semibold">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile, index) => (
                    <tr
                      key={profile._id}
                      className={`border-b border-gray-700/50 transition-all duration-300 hover:bg-gray-700/30 ${
                        index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {profile.user?.name?.charAt(0) || "U"}
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {profile.user?.name || "نامشخص"}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {profile.user?.email || "ایمیل ندارد"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {profile.user?.phone || "شماره ندارد"}
                          </div>
                          <div className="text-gray-400 text-sm">
                            کد ملی: {profile.idNumber || "---"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm">
                          <Clock className="w-3 h-3" />
                          در انتظار تایید
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAction(profile._id, "accept")}
                            disabled={actionLoading === profile._id}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
                          >
                            {actionLoading === profile._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            تأیید
                          </button>
                          <button
                            onClick={() => handleAction(profile._id, "reject")}
                            disabled={actionLoading === profile._id}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
                          >
                            {actionLoading === profile._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
                            رد
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* فوتر */}
        {!loading && filteredProfiles.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            نمایش {filteredProfiles.length} از {profiles.length} درخواست
          </div>
        )}
      </div>
    </div>
  );
}
