"use client";
import { useState, useEffect } from "react";
import { useConfirm } from "@/context/ConfirmProvider";
import {
  Calendar,
  Plus,
  History,
  Play,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Dumbbell,
  Zap,
  X,
  Edit3,
  Trash2,
} from "lucide-react";
import CreateProgramModal from "../program/CreateProgramModal";
import toast, { Toaster } from "react-hot-toast";

export default function ProgramTab({ user }) {
  const [programs, setPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [viewMode, setViewMode] = useState("overview");
  const [editingProgram, setEditingProgram] = useState(null);
  const confirm = useConfirm();

  useEffect(() => {
    if (user?.user?._id) {
      fetchUserPrograms();
    }
  }, [user]);

  const fetchUserPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/workout-programs?userId=${user.user._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setPrograms(data.data.programs);
        const activeProgram = data.data.programs.find(
          (p) => p.status === "فعال"
        );
        setCurrentProgram(activeProgram || data.data.programs[0] || null);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setPrograms([]);
      setCurrentProgram(null);
    } finally {
      setLoading(false);
    }
  };

  // تابع حذف برنامه
  const handleDeleteProgram = async (programId) => {
    const isConfirmed = await confirm(
      "حذف برنامه",
      `آیا از حذف برنامه مطمئن هستید؟`,
      "danger"
    );

    if (isConfirmed) {
      try {
        const response = await fetch(`/api/workout-programs/${programId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.status === "success") {
          const updatedPrograms = programs.filter((p) => p._id !== programId);
          setPrograms(updatedPrograms);

          if (currentProgram && currentProgram._id === programId) {
            setCurrentProgram(updatedPrograms[0] || null);
          }

          toast.success("برنامه با موفقیت حذف شد");
        } else {
          toast.error("خطا در حذف برنامه: " + data.message);
        }
      } catch (error) {
        toast.error("خطا در حذف برنامه");
      }
    }
  };

  // تابع ویرایش برنامه
  // تابع ویرایش برنامه - اصلاح شده
  const handleEditProgram = async (program) => {
    try {
      console.log("Fetching program for edit:", program._id);

      const response = await fetch(`/api/workout-programs/${program._id}`);

      // چک کردن status response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // چک کردن اینکه response خالی نیست
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!responseText) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(responseText);
      console.log("Parsed data:", data);

      if (data.status === "success") {
        setEditingProgram(data.data.program);
        setShowCreateModal(true);
      } else {
        toast.error(
          "خطا در دریافت اطلاعات برنامه: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast.error("خطا در دریافت اطلاعات برنامه: " + error.message);
    }
  };
  const handleCreateProgram = () => {
    setEditingProgram(null);
    setShowCreateModal(true);
  };

  const handleDaySelect = (day) => {
    setActiveDay(day);
    setViewMode("day");
  };

  const handleBackToOverview = () => {
    setActiveDay(null);
    setViewMode("overview");
  };

  const handleCompleteExercise = async (dayIndex, exerciseIndex, setIndex) => {
    console.log("Complete exercise:", { dayIndex, exerciseIndex, setIndex });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded-xl w-40 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-700/50 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر و دکمه‌ها */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">برنامه تمرینی</h3>
          <p className="text-gray-400 text-sm mt-1">
            {currentProgram ? currentProgram.title : "برنامه‌ای تعریف نشده"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("history")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            تاریخچه
          </button>
          <button
            onClick={handleCreateProgram}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            برنامه جدید
          </button>
        </div>
      </div>

      {/* محتوای اصلی */}
      {viewMode === "overview" && currentProgram && (
        <ProgramOverview
          program={currentProgram}
          onDaySelect={handleDaySelect}
          onEditProgram={handleEditProgram}
          onDeleteProgram={handleDeleteProgram}
        />
      )}

      {viewMode === "day" && activeDay && (
        <DayWorkoutView
          day={activeDay}
          onBack={handleBackToOverview}
          onCompleteExercise={handleCompleteExercise}
        />
      )}

      {viewMode === "history" && (
        <ProgramHistory
          programs={programs}
          onBack={() => setViewMode("overview")}
          onProgramSelect={setCurrentProgram}
          onEditProgram={handleEditProgram}
          onDeleteProgram={handleDeleteProgram}
        />
      )}

      {!currentProgram && viewMode === "overview" && (
        <EmptyProgram onCreateProgram={handleCreateProgram} />
      )}

      {/* مودال ایجاد/ویرایش برنامه */}
      {showCreateModal && (
        <CreateProgramModal
          user={user}
          program={editingProgram}
          onClose={() => {
            setShowCreateModal(false);
            setEditingProgram(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingProgram(null);
            fetchUserPrograms();
            setViewMode("overview");
          }}
        />
      )}

      <Toaster />
    </div>
  );
}

// کامپوننت نمایش کلی برنامه
function ProgramOverview({
  program,
  onDaySelect,
  onEditProgram,
  onDeleteProgram,
}) {
  const days = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  return (
    <div className="space-y-6">
      {/* اطلاعات برنامه */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-green-400" />
            <div>
              <h4 className="text-lg font-bold text-white">{program.title}</h4>
              <p className="text-gray-400 text-sm">{program.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEditProgram(program)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              ویرایش
            </button>
            <button
              onClick={() => onDeleteProgram(program._id)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          </div>
        </div>

        {/* آمار برنامه */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ProgramStat label="هدف" value={program.goal} />
          <ProgramStat label="سطح" value={program.level} />
          <ProgramStat label="مدت" value={`${program.duration} هفته`} />
          <ProgramStat
            label="پیشرفت"
            value={`${program.progress?.completionRate || 0}%`}
          />
        </div>

        {/* Navigator روزهای هفته */}
        <WeekNavigator program={program} onDaySelect={onDaySelect} />
      </div>

      {/* جزئیات روزهای فعال */}
      <div className="space-y-4">
        {program.days
          .filter((day) => day.active)
          .map((day, index) => (
            <DayPreview
              key={index}
              day={day}
              onSelect={() => onDaySelect(day)}
            />
          ))}
      </div>
    </div>
  );
}

// کامپوننت Navigator روزهای هفته
function WeekNavigator({ program, onDaySelect }) {
  const days = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          برنامه هفتگی
        </h4>
        <div className="text-sm text-gray-400">
          {program.days.filter((d) => d.active).length} روز فعال
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((dayName, index) => {
          const dayNumber = index + 1;
          const dayData = program.days.find((d) => d.dayNumber === dayNumber);
          const isActive = dayData?.active;

          return (
            <button
              key={dayNumber}
              onClick={() => isActive && onDaySelect(dayData)}
              disabled={!isActive}
              className={`
                p-3 rounded-xl text-center transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-700/50 border border-gray-600 hover:bg-gray-600/50 hover:scale-102 cursor-pointer"
                    : "bg-gray-800/30 border border-gray-700 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <div className="font-bold text-sm mb-1">{dayName}</div>
              <div className="text-xs min-h-[40px] flex items-center justify-center">
                {isActive ? (
                  <div className="space-y-1">
                    <div className="font-medium text-white">
                      {dayData.focus}
                    </div>
                    <div className="text-gray-300">
                      {dayData.exercises?.length || 0} حرکت
                    </div>
                  </div>
                ) : (
                  <span>⏸</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// کامپوننت پیش‌نمایش روز
function DayPreview({ day, onSelect }) {
  const dayNames = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  return (
    <div
      onClick={onSelect}
      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-green-400" />
            {dayNames[day.dayNumber - 1]} - {day.focus}
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            مدت زمان: {day.duration} دقیقه
          </p>
        </div>
        <div className="text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded">
          {day.exercises?.length || 0} حرکت
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {day.exercises?.slice(0, 3).map((exercise, index) => (
          <div
            key={index}
            className="bg-gray-700/30 rounded-xl p-3 border border-gray-600"
          >
            <div className="font-medium text-white text-sm">
              {exercise.name}
            </div>
            <div className="text-gray-400 text-xs">
              {exercise.sets} ست × {exercise.reps}
            </div>
          </div>
        ))}
        {day.exercises?.length > 3 && (
          <div className="bg-gray-700/30 rounded-xl p-3 border border-gray-600 text-center">
            <div className="text-gray-400 text-sm">
              +{day.exercises.length - 3} حرکت دیگر
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت نمایش جزئیات روز تمرینی
function DayWorkoutView({ day, onBack, onCompleteExercise }) {
  const [supersetMode, setSupersetMode] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState(new Set());
  const dayNames = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  const handleSupersetToggle = (exerciseId) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exerciseId)) {
      newSelected.delete(exerciseId);
    } else {
      newSelected.add(exerciseId);
    }
    setSelectedExercises(newSelected);
  };

  const activateSuperset = () => {
    if (selectedExercises.size >= 2) {
      console.log("سوپرست فعال برای:", Array.from(selectedExercises));
      setSelectedExercises(new Set());
      setSupersetMode(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* هدر روز */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          بازگشت به برنامه
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white">
            {dayNames[day.dayNumber - 1]}
          </h3>
          <p className="text-green-400">{day.focus}</p>
        </div>

        <div className="flex gap-2">
          {supersetMode && selectedExercises.size >= 2 && (
            <button
              onClick={activateSuperset}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              فعال کردن سوپرست
            </button>
          )}
          <button
            onClick={() => setSupersetMode(!supersetMode)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              supersetMode
                ? "bg-purple-500/20 border-purple-500 text-purple-300"
                : "bg-gray-700 border-gray-600 text-gray-300"
            }`}
          >
            سوپرست
          </button>
        </div>
      </div>

      {/* اطلاعات روز */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">مدت زمان</div>
            <div className="text-white font-bold">{day.duration} دقیقه</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">تعداد حرکات</div>
            <div className="text-white font-bold">
              {day.exercises?.length || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">عضله هدف</div>
            <div className="text-green-400 font-bold">{day.focus}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">سطح</div>
            <div className="text-yellow-400 font-bold">متوسط</div>
          </div>
        </div>
      </div>

      {/* لیست حرکات */}
      <div className="space-y-3">
        {day.exercises?.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id || index}
            exercise={exercise}
            supersetMode={supersetMode}
            isSelected={selectedExercises.has(exercise.id)}
            onSelect={() => handleSupersetToggle(exercise.id)}
            onCompleteSet={(setIndex) =>
              onCompleteExercise(day.dayNumber, index, setIndex)
            }
          />
        ))}
      </div>

      {(!day.exercises || day.exercises.length === 0) && (
        <div className="text-center py-12 bg-gray-700/30 rounded-2xl border border-gray-600">
          <Dumbbell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-400 mb-2">
            هیچ حرکتی تعریف نشده
          </h4>
          <p className="text-gray-500 text-sm">
            برای این روز تمرینی حرکتی اضافه نشده است
          </p>
        </div>
      )}
    </div>
  );
}

// کامپوننت کارت حرکت
function ExerciseCard({
  exercise,
  supersetMode,
  isSelected,
  onSelect,
  onCompleteSet,
}) {
  const [completedSets, setCompletedSets] = useState([]);

  const toggleSet = (setIndex) => {
    const newCompleted = [...completedSets];
    if (newCompleted.includes(setIndex)) {
      newCompleted.splice(newCompleted.indexOf(setIndex), 1);
    } else {
      newCompleted.push(setIndex);
    }
    setCompletedSets(newCompleted);
    onCompleteSet(setIndex);
  };

  return (
    <div
      className={`
        bg-gray-800/50 rounded-xl p-4 border-2 transition-all
        ${
          supersetMode && isSelected
            ? "border-purple-500 bg-purple-500/10"
            : "border-gray-700"
        }
        ${supersetMode ? "cursor-pointer hover:border-purple-400" : ""}
      `}
      onClick={supersetMode ? onSelect : undefined}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="font-bold text-white text-lg">{exercise.name}</div>
          <div className="text-gray-400 text-sm">{exercise.name_en}</div>
        </div>

        <div className="text-left">
          <div className="text-white">
            {exercise.sets} ست × {exercise.reps}
          </div>
          <div className="text-gray-400 text-sm">استراحت: {exercise.rest}</div>
        </div>
      </div>

      {/* ست‌ها */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: exercise.sets }).map((_, setIndex) => (
          <button
            key={setIndex}
            onClick={(e) => {
              e.stopPropagation();
              if (!supersetMode) toggleSet(setIndex);
            }}
            className={`
              p-2 rounded-lg text-center transition-all
              ${
                completedSets.includes(setIndex)
                  ? "bg-green-500/20 border border-green-500 text-green-300"
                  : "bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600/50"
              }
              ${supersetMode ? "cursor-default" : "cursor-pointer"}
            `}
          >
            <div className="font-bold">ست {setIndex + 1}</div>
            <div className="text-xs">{exercise.reps}</div>
            {completedSets.includes(setIndex) && (
              <CheckCircle className="w-4 h-4 mx-auto mt-1" />
            )}
          </button>
        ))}
      </div>

      {/* سوپرست ایندیکیتور */}
      {supersetMode && isSelected && (
        <div className="flex items-center gap-1 mt-2 text-purple-400 text-sm">
          <Zap className="w-4 h-4" />
          انتخاب شده برای سوپرست
        </div>
      )}
    </div>
  );
}

// کامپوننت تاریخچه برنامه‌ها
function ProgramHistory({
  programs,
  onBack,
  onProgramSelect,
  onEditProgram,
  onDeleteProgram,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          بازگشت
        </button>
        <h3 className="text-xl font-bold text-white">تاریخچه برنامه‌ها</h3>
        <div className="w-20"></div>
      </div>

      <div className="grid gap-4">
        {programs.map((program, index) => (
          <div
            key={program._id || index}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {program.title}
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  {program.description}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    program.status === "فعال"
                      ? "bg-green-500/20 text-green-300"
                      : program.status === "تکمیل شده"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {program.status}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onProgramSelect(program)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    مشاهده
                  </button>
                  <button
                    onClick={() => onEditProgram(program)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProgram(program._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">هدف</div>
                <div className="text-white">{program.goal}</div>
              </div>
              <div>
                <div className="text-gray-400">سطح</div>
                <div className="text-white">{program.level}</div>
              </div>
              <div>
                <div className="text-gray-400">پیشرفت</div>
                <div className="text-green-400">
                  {program.progress?.completionRate || 0}%
                </div>
              </div>
              <div>
                <div className="text-gray-400">تاریخ شروع</div>
                <div className="text-white">
                  {new Date(program.startDate).toLocaleDateString("fa-IR")}
                </div>
              </div>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="text-center py-12 bg-gray-700/30 rounded-2xl border border-gray-600">
            <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-400 mb-2">
              تاریخچه‌ای موجود نیست
            </h4>
            <p className="text-gray-500 text-sm">
              هنوز برنامه‌ای ایجاد نکرده‌اید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت برنامه خالی
function EmptyProgram({ onCreateProgram }) {
  return (
    <div className="text-center py-12 bg-gray-700/30 rounded-2xl border border-gray-600">
      <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h4 className="text-lg font-bold text-gray-400 mb-2">
        برنامه‌ای تعریف نشده
      </h4>
      <p className="text-gray-500 text-sm mb-6">
        برای این شاگرد هنوز برنامه تمرینی ایجاد نشده است
      </p>
      <button
        onClick={onCreateProgram}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        ایجاد اولین برنامه
      </button>
    </div>
  );
}

// کامپوننت آمار برنامه
function ProgramStat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="text-white font-bold">{value}</div>
    </div>
  );
}
