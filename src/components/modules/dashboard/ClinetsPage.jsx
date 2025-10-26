"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Users, Filter, UserCheck, Phone, Mail } from "lucide-react";
import ClientModal from "./usersInfo/ClientModal";

export default function ClientsPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.success) {
          setUsers(data.data);
          setFiltered(data.data);
        }
      } catch (err) {
        console.error("Error fetching approved users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedUsers();
  }, []);

  // فیلتر پیشرفته
  const filteredUsers = useMemo(() => {
    let result = users;

    // فیلتر جستجو
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.user?.name?.toLowerCase().includes(query) ||
          user.user?.phone?.includes(query) ||
          user.user?.email?.toLowerCase().includes(query)
      );
    }

    // فیلتر وضعیت
    if (activeFilter !== "all") {
      result = result.filter(
        (user) => user.status === activeFilter || user.gender === activeFilter
      );
    }

    return result;
  }, [users, search, activeFilter]);

  const handleOpenModal = async (user) => {
    setModalLoading(true);
    setSelectedUser(user);
    // شبیه‌سازی لود داده‌های بیشتر
    setTimeout(() => setModalLoading(false), 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="h-12 bg-gray-700 rounded-lg mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg mb-3"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-3">
            مدیریت شاگردان
          </h1>
          <p className="text-gray-400">مدیریت و پیگیری وضعیت شاگردان باشگاه</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="کل شاگردان"
            value={users.length}
            color="blue"
          />
          <StatCard
            icon={<UserCheck className="w-6 h-6" />}
            title="فعال"
            value={users.filter((u) => u.status === "active").length}
            color="green"
          />
          <StatCard
            icon={<Filter className="w-6 h-6" />}
            title="مرد"
            value={users.filter((u) => u.gender === "male").length}
            color="purple"
          />
          <StatCard
            icon={<Filter className="w-6 h-6" />}
            title="زن"
            value={users.filter((u) => u.gender === "female").length}
            color="pink"
          />
        </div>
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* جستجو */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس نام، شماره تلفن یا ایمیل..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
              />
            </div>

            {/* فیلترها */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "همه", emoji: "👥" },
                { value: "active", label: "فعال", emoji: "✅" },
                { value: "male", label: "مرد", emoji: "👨" },
                { value: "female", label: "زن", emoji: "👩" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeFilter === filter.value
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* لیست شاگردان */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              لیست شاگردان ({filteredUsers.length})
            </h2>
            <span className="text-gray-400 text-sm">
              برای مشاهده جزئیات کلیک کنید
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">شاگردی یافت نشد</p>
              <p className="text-gray-500 text-sm mt-2">
                {search
                  ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                  : "هنوز شاگردی ثبت نام نکرده است"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredUsers.map((profile) => (
                <UserCard
                  key={profile._id}
                  profile={profile}
                  onClick={() => handleOpenModal(profile)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* مودال */}
      <ClientModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        loading={modalLoading}
      />
    </div>
  );
}

// کامپوننت کارت کاربر
function UserCard({ profile, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-xl p-4 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* آواتار */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile.user?.name?.charAt(0) || "U"}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                profile.status === "active" ? "bg-green-500" : "bg-gray-500"
              }`}
            ></div>
          </div>

          {/* اطلاعات */}
          <div>
            <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
              {profile.user?.name || "بدون نام"}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>{profile.user?.phone}</span>
              </div>
              {profile.user?.email && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">{profile.user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات جانبی */}
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                profile.gender === "male"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-pink-500/20 text-pink-300"
              }`}
            >
              {profile.gender === "male" ? "مرد" : "زن"}
            </span>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
              {profile.height}cm / {profile.weight}kg
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            BMI: {profile.bmi || "--"}
          </div>
        </div>
      </div>
    </div>
  );
}

// کامپوننت آمار
function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    pink: "from-pink-500 to-rose-500",
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
