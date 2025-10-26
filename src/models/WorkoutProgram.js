import mongoose from "mongoose";

const workoutProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
    default: 4,
  },
  level: {
    type: String,
    enum: ["مبتدی", "متوسط", "پیشرفته"],
    default: "مبتدی",
  },
  goal: {
    type: String,
    enum: [
      "کاهش وزن",
      "افزایش وزن",
      "افزایش قدرت",
      "افزایش حجم",
      "تعادل",
      "استقامت",
    ],
    required: true,
  },
  days: [
    {
      dayNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
      dayName: {
        type: String,
        enum: [
          "شنبه",
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
        ],
        required: true,
      },
      active: {
        type: Boolean,
        default: true,
      },
      focus: {
        type: String,
        default: "بدون تمرین", // مقدار پیش‌فرض اضافه شد
      },
      exercises: [
        {
          exerciseId: {
            type: String, // تغییر از ObjectId به String
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          name_en: {
            type: String,
            required: true,
          },
          sets: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
          },
          reps: {
            type: String,
            required: true,
          },
          rest: {
            type: String,
            default: "60 ثانیه",
          },
          notes: {
            type: String,
            trim: true,
          },
          order: {
            type: Number,
            default: 0,
          },
        },
      ],
      duration: {
        type: Number,
        default: 60,
      },
      notes: {
        type: String,
        trim: true,
      },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["فعال", "متوقف", "تکمیل شده"],
    default: "فعال",
  },
  progress: {
    completedSessions: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
  },
  settings: {
    includeWarmup: {
      type: Boolean,
      default: true,
    },
    includeCooldown: {
      type: Boolean,
      default: true,
    },
    trackWeight: {
      type: Boolean,
      default: true,
    },
    trackMeasurements: {
      type: Boolean,
      default: true,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// ایندکس‌ها
workoutProgramSchema.index({ userId: 1, status: 1 });
workoutProgramSchema.index({ coachId: 1, created_at: -1 });
workoutProgramSchema.index({ startDate: 1, endDate: 1 });

// محاسبه اتوماتیک totalSessions
workoutProgramSchema.pre("save", function (next) {
  this.totalSessions =
    this.days.filter((day) => day.active).length * this.duration;
  if (this.totalSessions > 0) {
    this.progress.completionRate = Math.round(
      (this.progress.completedSessions / this.totalSessions) * 100
    );
  }
  next();
});

export default mongoose.models.WorkoutProgram ||
  mongoose.model("WorkoutProgram", workoutProgramSchema);
