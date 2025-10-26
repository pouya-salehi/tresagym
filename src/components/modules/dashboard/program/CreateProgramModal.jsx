"use client";
import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Dumbbell,
  Save,
} from "lucide-react";

const MUSCLE_GROUPS = [
  "سینه",
  "پشت",
  "پا",
  "شانه",
  "بازو",
  "ساق",
  "شکم",
  "کاردیو",
];
const DAYS = [
  { number: 1, name: "شنبه" },
  { number: 2, name: "یکشنبه" },
  { number: 3, name: "دوشنبه" },
  { number: 4, name: "سه‌شنبه" },
  { number: 5, name: "چهارشنبه" },
  { number: 6, name: "پنجشنبه" },
  { number: 7, name: "جمعه" },
];

export default function CreateProgramModal({ user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [exercisesData, setExercisesData] = useState(null);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [selectedDayForExercise, setSelectedDayForExercise] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "افزایش حجم",
    level: "مبتدی",
    duration: 4,
    days: DAYS.map((day) => ({
      dayNumber: day.number,
      dayName: day.name,
      active: false,
      focus: "",
      exercises: [],
      duration: 60,
    })),
  });

  // لود کردن دیتای حرکات از فایل JSON
  useEffect(() => {
    const loadExercisesData = async () => {
      try {
        setLoadingExercises(true);
        const response = await fetch("/data/exercises.json");
        if (!response.ok) {
          throw new Error("Failed to load exercises data");
        }
        const data = await response.json();
        setExercisesData(data);
      } catch (error) {
        console.error("Error loading exercises:", error);
        // فال‌بک به داده‌های پیش‌فرض
        setExercisesData({ exercises: [] });
      } finally {
        setLoadingExercises(false);
      }
    };

    loadExercisesData();
  }, []);

  // تابع برای گروه‌بندی حرکات بر اساس muscle_group
  const getExercisesByMuscleGroup = () => {
    if (!exercisesData?.exercises) return {};

    const grouped = {};
    exercisesData.exercises.forEach((exercise) => {
      if (!grouped[exercise.muscle_group]) {
        grouped[exercise.muscle_group] = [];
      }
      grouped[exercise.muscle_group].push(exercise);
    });
    return grouped;
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      alert("لطفاً عنوان برنامه را وارد کنید");
      return;
    }

    // اعتبارسنجی روزهای فعال
    const activeDays = formData.days.filter((day) => day.active);
    if (activeDays.length === 0) {
      alert("لطفاً حداقل یک روز فعال انتخاب کنید");
      return;
    }

    // اعتبارسنجی focus برای روزهای فعال
    for (const day of activeDays) {
      if (!day.focus || day.focus.trim() === "") {
        alert(`لطفاً برای روز ${day.dayName} عضله هدف را انتخاب کنید`);
        return;
      }
    }

    setLoading(true);
    try {
      // تبدیل داده‌ها به فرمت مورد نیاز
      const requestData = {
        title: formData.title,
        description: formData.description,
        userId: user.user._id,
        duration: formData.duration,
        level: formData.level,
        goal: formData.goal,
        days: formData.days
          .filter((day) => day.active)
          .map((day) => ({
            dayNumber: day.dayNumber,
            dayName: day.dayName,
            active: day.active,
            focus: day.focus,
            exercises: day.exercises.map((exercise, index) => ({
              exerciseId: exercise.id, // استفاده از id اصلی
              name: exercise.name,
              name_en: exercise.name_en,
              sets: exercise.sets || 3,
              reps: exercise.reps || "8-12",
              rest: exercise.rest || "60 ثانیه",
              order: index,
            })),
            duration: day.duration,
          })),
      };

      console.log("Sending data to API:", JSON.stringify(requestData, null, 2));

      const response = await fetch("/api/workout-programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.status === "success") {
        onSuccess();
      } else {
        alert(data.message || "خطا در ایجاد برنامه");
      }
    } catch (error) {
      console.error("Error creating program:", error);
      alert("خطا در ایجاد برنامه");
    } finally {
      setLoading(false);
    }
  };

  const toggleDayActive = (dayIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].active = !newDays[dayIndex].active;

    if (!newDays[dayIndex].active) {
      newDays[dayIndex].focus = "";
      newDays[dayIndex].exercises = [];
    }

    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const changeDayFocus = (dayIndex, focus) => {
    const newDays = [...formData.days];
    newDays[dayIndex].focus = focus;

    // اضافه کردن حرکات پیش‌فرض برای عضله انتخاب شده
    const exercisesByMuscle = getExercisesByMuscleGroup();
    if (focus && exercisesByMuscle[focus]) {
      // فقط 3 حرکت اول رو به عنوان پیش‌فرض اضافه کن
      const defaultExercises = exercisesByMuscle[focus]
        .slice(0, 3)
        .map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          name_en: exercise.name_en,
          sets: exercise.sets || 3,
          reps: exercise.reps || "8-12",
          rest: exercise.rest || "60 ثانیه",
          gif: exercise.gif,
          muscle_group: exercise.muscle_group,
        }));
      newDays[dayIndex].exercises = defaultExercises;
    } else {
      newDays[dayIndex].exercises = [];
    }

    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const addExerciseToDay = (dayIndex, exercise) => {
    const newDays = [...formData.days];
    const newExercise = {
      ...exercise,
      id: `${exercise.id}_${Date.now()}`,
      order: newDays[dayIndex].exercises.length,
    };
    newDays[dayIndex].exercises.push(newExercise);
    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const removeExerciseFromDay = (dayIndex, exerciseIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const updateExercise = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exerciseIndex][field] = value;
    setFormData((prev) => ({ ...prev, days: newDays }));
  };

  const activeDaysCount = formData.days.filter((day) => day.active).length;

  if (loadingExercises) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">در حال بارگذاری حرکات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* هدر */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">
                ایجاد برنامه جدید
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                برای {user?.user?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* تب‌ها */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "basic"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              اطلاعات پایه
            </button>
            <button
              onClick={() => setActiveTab("days")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "days"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              روزهای تمرین ({activeDaysCount})
            </button>
          </div>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "basic" && (
            <BasicInfoTab formData={formData} setFormData={setFormData} />
          )}

          {activeTab === "days" && (
            <DaysTab
              formData={formData}
              toggleDayActive={toggleDayActive}
              changeDayFocus={changeDayFocus}
              addExerciseToDay={addExerciseToDay}
              removeExerciseFromDay={removeExerciseFromDay}
              updateExercise={updateExercise}
              onOpenExerciseSearch={(dayIndex) => {
                setSelectedDayForExercise(dayIndex);
                setShowExerciseSearch(true);
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800/50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || activeDaysCount === 0}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  در حال ایجاد...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  ایجاد برنامه
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* مودال جستجوی حرکات */}
      {showExerciseSearch && exercisesData && (
        <ExerciseSearchModal
          exercisesData={exercisesData.exercises || []}
          onClose={() => {
            setShowExerciseSearch(false);
            setSelectedDayForExercise(null);
          }}
          onExerciseSelect={(exercise) => {
            if (selectedDayForExercise !== null) {
              addExerciseToDay(selectedDayForExercise, exercise);
            }
            setShowExerciseSearch(false);
            setSelectedDayForExercise(null);
          }}
        />
      )}
    </div>
  );
}

// تب اطلاعات پایه
function BasicInfoTab({ formData, setFormData }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="text-white text-sm mb-2 block">عنوان برنامه *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="مثال: برنامه مبتدی ۴ هفته‌ای برای افزایش حجم"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">توضیحات</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          placeholder="توضیحات مختصر درباره برنامه..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-white text-sm mb-2 block">هدف</label>
          <select
            value={formData.goal}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, goal: e.target.value }))
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="افزایش حجم">افزایش حجم</option>
            <option value="کاهش وزن">کاهش وزن</option>
            <option value="افزایش قدرت">افزایش قدرت</option>
            <option value="تعادل">تعادل</option>
            <option value="استقامت">استقامت</option>
          </select>
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">سطح</label>
          <select
            value={formData.level}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, level: e.target.value }))
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="مبتدی">مبتدی</option>
            <option value="متوسط">متوسط</option>
            <option value="پیشرفته">پیشرفته</option>
          </select>
        </div>

        <div>
          <label className="text-white text-sm mb-2 block">مدت (هفته)</label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                duration: parseInt(e.target.value),
              }))
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={2}>۲ هفته</option>
            <option value={4}>۴ هفته</option>
            <option value={8}>۸ هفته</option>
            <option value={12}>۱۲ هفته</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// تب روزهای تمرین
function DaysTab({
  formData,
  toggleDayActive,
  changeDayFocus,
  addExerciseToDay,
  removeExerciseFromDay,
  updateExercise,
  onOpenExerciseSearch,
}) {
  const [expandedDays, setExpandedDays] = useState(new Set());

  const toggleDayExpanded = (dayIndex) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  return (
    <div className="p-6 space-y-4">
      {formData.days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
        >
          {/* هدر روز */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={day.active}
                onChange={() => toggleDayActive(dayIndex)}
                className="w-5 h-5 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <div>
                <div className="text-white font-medium">{day.dayName}</div>
                {day.active && day.focus && (
                  <div className="text-green-400 text-sm">{day.focus}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {day.active && (
                <>
                  <span className="text-gray-400 text-sm">
                    {day.exercises.length} حرکت
                  </span>
                  <button
                    onClick={() => toggleDayExpanded(dayIndex)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    {expandedDays.has(dayIndex) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* محتوای روز */}
          {day.active && (
            <div className="border-t border-gray-700">
              {/* انتخاب عضله */}
              <div className="p-4 border-b border-gray-700">
                <label className="text-white text-sm mb-2 block">
                  عضله هدف
                </label>
                <select
                  value={day.focus}
                  onChange={(e) => changeDayFocus(dayIndex, e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">انتخاب کنید</option>
                  {MUSCLE_GROUPS.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>

              {/* لیست حرکات */}
              {expandedDays.has(dayIndex) && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">حرکات</h4>
                    <button
                      onClick={() => onOpenExerciseSearch(dayIndex)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن حرکت
                    </button>
                  </div>

                  {day.exercises.map((exercise, exIndex) => (
                    <ExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      onUpdate={(field, value) =>
                        updateExercise(dayIndex, exIndex, field, value)
                      }
                      onRemove={() => removeExerciseFromDay(dayIndex, exIndex)}
                    />
                  ))}

                  {day.exercises.length === 0 && (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-600 rounded-xl">
                      <Dumbbell className="w-8 h-8 mx-auto mb-2" />
                      هنوز حرکتی اضافه نشده است
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// کامپوننت آیتم حرکت
function ExerciseItem({ exercise, onUpdate, onRemove }) {
  return (
    <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="font-bold text-white">{exercise.name}</div>
          <div className="text-gray-400 text-sm">{exercise.name_en}</div>
          {exercise.gif && (
            <div className="mt-2">
              <img
                src={exercise.gif}
                alt={exercise.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">تعداد ست</label>
          <input
            type="number"
            min="1"
            max="10"
            value={exercise.sets}
            onChange={(e) => onUpdate("sets", parseInt(e.target.value))}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg py-1 px-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">
            تعداد تکرار
          </label>
          <input
            type="text"
            value={exercise.reps}
            onChange={(e) => onUpdate("reps", e.target.value)}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg py-1 px-2 text-white text-sm"
            placeholder="8-12"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">استراحت</label>
          <input
            type="text"
            value={exercise.rest}
            onChange={(e) => onUpdate("rest", e.target.value)}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg py-1 px-2 text-white text-sm"
            placeholder="60 ثانیه"
          />
        </div>
      </div>
    </div>
  );
}

// مودال جستجوی حرکات
function ExerciseSearchModal({ exercisesData, onClose, onExerciseSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("همه");

  const filteredExercises = exercisesData.filter((exercise) => {
    if (!exercise) return false;

    const matchesSearch =
      searchTerm === "" ||
      (exercise.name && exercise.name.includes(searchTerm)) ||
      (exercise.name_en &&
        exercise.name_en.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMuscle =
      selectedMuscle === "همه" || exercise.muscle_group === selectedMuscle;

    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">
            جستجوی حرکات ({filteredExercises.length})
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="جستجوی حرکت (فارسی یا انگلیسی)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl py-3 px-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="همه">همه عضلات</option>
              {MUSCLE_GROUPS.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[500px] p-4">
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredExercises.map((exercise, index) => (
                <button
                  key={exercise.id || index}
                  onClick={() => onExerciseSelect(exercise)}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 transition-colors text-white text-start"
                >
                  <div className="flex gap-3">
                    {exercise.gif && (
                      <div className="flex-shrink-0">
                        <img
                          src={exercise.gif}
                          alt={exercise.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-white mb-1">
                        {exercise.name || "بدون نام"}
                      </div>
                      <div className="text-gray-400 text-sm mb-2">
                        {exercise.name_en || "No English name"}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded">
                          {exercise.muscle_group || "نامشخص"}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {exercise.sets || 3} ست × {exercise.reps || "8-12"}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        {exercise.equipment || "بدون تجهیزات"} •{" "}
                        {exercise.level || "مبتدی"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              {searchTerm || selectedMuscle !== "همه"
                ? "هیچ حرکتی با این فیلترها یافت نشد"
                : "لطفاً برای جستجو تایپ کنید"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
