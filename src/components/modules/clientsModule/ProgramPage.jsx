"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Play,
  CheckCircle,
  Clock,
  Target,
  Award,
  ChevronRight,
  Dumbbell,
  Zap,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

export default function ClientProgramPage() {
  const [currentProgram, setCurrentProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(null);
  const [view, setView] = useState("overview"); // overview, day, progress

  useEffect(() => {
    fetchUserProgram();
  }, []);

  const fetchUserProgram = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/workout-programs?myPrograms=true");

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.programs.length > 0) {
          // برنامه فعال رو پیدا کن یا اولین برنامه رو بگیر
          const activeProgram =
            data.data.programs.find((p) => p.status === "فعال") ||
            data.data.programs[0];
          setCurrentProgram(activeProgram);
        }
      }
    } catch (error) {
      console.error("Error fetching program:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentProgram) {
    return <NoProgramScreen />;
  }

  return (
    <div className="min-h-screen text-white">
      {/* هدر */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Dumbbell className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">برنامه تمرینی من</h1>
                <p className="text-gray-400 text-sm">برنامه شخصی‌سازی شده</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setView("progress")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                پیشرفت
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {view === "overview" && (
          <ProgramOverview
            program={currentProgram}
            onDaySelect={(day) => {
              setActiveDay(day);
              setView("day");
            }}
          />
        )}

        {view === "day" && activeDay && (
          <DayWorkoutView day={activeDay} onBack={() => setView("overview")} />
        )}

        {view === "progress" && (
          <ProgressView
            program={currentProgram}
            onBack={() => setView("overview")}
          />
        )}
      </main>
    </div>
  );
}

// کامپوننت نمایش کلی برنامه
function ProgramOverview({ program, onDaySelect }) {
  const today = new Date().getDay(); // 0: Sunday, 1: Monday, ...
  const persianDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  const todayName = persianDays[today === 0 ? 6 : today - 1]; // تبدیل به روزهای فارسی

  return (
    <div className="space-y-6">
      {/* کارت اطلاعات برنامه */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Target className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{program.title}</h2>
            <p className="text-gray-300">{program.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="مدت برنامه"
            value={`${program.duration} هفته`}
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label="سطح"
            value={program.level}
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="هدف"
            value={program.goal}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="پیشرفت"
            value={`${program.progress?.completionRate || 0}%`}
          />
        </div>
      </div>

      {/* کارت امروز */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Star className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold">تمرین امروز</h3>
        </div>

        {program.days.find((day) => day.dayName === todayName && day.active) ? (
          <TodayWorkout
            day={program.days.find((day) => day.dayName === todayName)}
            onStart={() =>
              onDaySelect(program.days.find((day) => day.dayName === todayName))
            }
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">
              امروز روز استراحت هست! 🎉
            </div>
            <div className="text-gray-500 text-sm">
              استراحت مناسب برای رشد عضلات ضروریه
            </div>
          </div>
        )}
      </div>

      {/* برنامه هفتگی */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-400" />
          برنامه هفتگی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.days
            .filter((day) => day.active)
            .map((day, index) => (
              <DayCard
                key={index}
                day={day}
                isToday={day.dayName === todayName}
                onSelect={() => onDaySelect(day)}
              />
            ))}
        </div>
      </div>

      {/* نکات مهم */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          نکات مهم
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <TipItem text="💧 حتماً آب کافی بنوشید" />
          <TipItem text="🕒 بین ست‌ها استراحت کنید" />
          <TipItem text="🎯 روی فرم صحیح تمرکز کنید" />
          <TipItem text="📱 پیشرفت خود را ثبت کنید" />
        </div>
      </div>
    </div>
  );
}

// کامپوننت کارت روز
function DayCard({ day, isToday, onSelect }) {
  const getDayColor = (focus) => {
    const colors = {
      سینه: "from-red-500/10 to-pink-500/10 border-red-500/20",
      پشت: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
      پا: "from-green-500/10 to-emerald-500/10 border-green-500/20",
      شانه: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
      بازو: "from-orange-500/10 to-amber-500/10 border-orange-500/20",
      شکم: "from-teal-500/10 to-cyan-500/10 border-teal-500/20",
    };
    return (
      colors[day.focus] || "from-gray-500/10 to-gray-600/10 border-gray-500/20"
    );
  };

  return (
    <button
      onClick={onSelect}
      className={`bg-gradient-to-r ${getDayColor(
        day.focus
      )} rounded-xl p-4 text-right transition-all hover:scale-105 border-2 ${
        isToday ? "ring-2 ring-blue-400 ring-opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {isToday && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          )}
          <span className="text-white font-bold text-lg">{day.dayName}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="text-white font-semibold mb-2">{day.focus}</div>
      <div className="text-gray-300 text-sm">
        {day.exercises?.length || 0} حرکت • {day.duration} دقیقه
      </div>

      {isToday && (
        <div className="mt-3 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
          امروز
        </div>
      )}
    </button>
  );
}

// کامپوننت تمرین امروز
function TodayWorkout({ day, onStart }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-white font-bold text-xl">{day.focus}</div>
          <div className="text-gray-400 text-sm">
            {day.exercises?.length || 0} حرکت
          </div>
        </div>
        <button
          onClick={onStart}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-bold"
        >
          <Play className="w-5 h-5" />
          شروع تمرین
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {day.exercises?.slice(0, 3).map((exercise, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
          >
            <span className="text-white text-sm">{exercise.name}</span>
            <span className="text-gray-400 text-sm">
              {exercise.sets} ست × {exercise.reps}
            </span>
          </div>
        ))}
        {day.exercises?.length > 3 && (
          <div className="text-center text-gray-500 text-sm py-2">
            +{day.exercises.length - 3} حرکت دیگر
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت نمایش روز تمرینی
function DayWorkoutView({ day, onBack }) {
  const [completedExercises, setCompletedExercises] = useState(new Set());

  const toggleExerciseComplete = (exerciseId) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const completionRate = day.exercises?.length
    ? Math.round((completedExercises.size / day.exercises.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          بازگشت
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold">{day.dayName}</h2>
          <div className="text-green-400 font-semibold">{day.focus}</div>
        </div>

        <div className="text-right">
          <div className="text-gray-400 text-sm">پیشرفت</div>
          <div className="text-white font-bold">{completionRate}%</div>
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="bg-gray-800 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>

      {/* لیست حرکات */}
      <div className="space-y-3">
        {day.exercises?.map((exercise, index) => (
          <div
            key={exercise.id || index}
            className={`bg-gray-800/50 rounded-xl p-4 border-2 transition-all ${
              completedExercises.has(exercise.id || index)
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-bold text-white text-lg">
                  {exercise.name}
                </div>
                <div className="text-gray-400 text-sm">{exercise.name_en}</div>
              </div>

              <button
                onClick={() => toggleExerciseComplete(exercise.id || index)}
                className={`p-2 rounded-lg transition-colors ${
                  completedExercises.has(exercise.id || index)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="bg-gray-700/50 rounded-lg p-2 text-center border border-gray-600"
                >
                  <div className="font-bold text-white text-sm">
                    ست {setIndex + 1}
                  </div>
                  <div className="text-gray-400 text-xs">{exercise.reps}</div>
                </div>
              ))}
            </div>

            <div className="text-gray-400 text-xs mt-2">
              استراحت: {exercise.rest}
            </div>
          </div>
        ))}
      </div>

      {/* دکمه اتمام تمرین */}
      {completionRate === 100 && (
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
          <Award className="w-6 h-6" />
          آفرین! تمرین امروز تموم شد 🎉
        </button>
      )}
    </div>
  );
}

// کامپوننت‌های کمکی
function StatCard({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-white font-bold text-lg flex items-center justify-center gap-2">
        {icon}
        {value}
      </div>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div className="flex items-center gap-2 text-amber-300">
      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
      {text}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white text-lg">در حال بارگذاری برنامه...</div>
      </div>
    </div>
  );
}

function NoProgramScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Dumbbell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            برنامه‌ای وجود ندارد
          </h2>
          <p className="text-gray-400 mb-6">
            هنوز برنامه تمرینی برای شما تنظیم نشده است. لطفاً با مربی خود تماس
            بگیرید.
          </p>
          <div className="space-y-3 text-sm text-gray-500">
            <div>📞 با پشتیبانی تماس بگیرید</div>
            <div>💬 در واتس‌اپ پیام دهید</div>
            <div>⏳ منتظر برنامه شخصی باشید</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// کامپوننت نمایش پیشرفت (می‌تونی کامل‌ترش کنی)
function ProgressView({ program, onBack }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          بازگشت
        </button>
        <h2 className="text-2xl font-bold">پیشرفت من</h2>
        <div className="w-20"></div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            سیستم پیگیری پیشرفت
          </h3>
          <p className="text-gray-400">به زودی در دسترس خواهد بود</p>
        </div>
      </div>
    </div>
  );
}
