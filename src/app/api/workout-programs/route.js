import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/utils/connectDB";
import WorkoutProgram from "@/models/WorkoutProgram";
import mongoose from "mongoose"; // اضافه کردن import mongoose

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

async function getUserFromToken(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// GET - دریافت برنامه‌های کاربر
// GET - دریافت برنامه‌های کاربر
export async function GET(request) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const myPrograms = searchParams.get("myPrograms"); // اضافه کردن این خط

    console.log(
      "GET Workout Programs - User:",
      user.sub,
      "Target User:",
      userId,
      "MyPrograms:",
      myPrograms
    );

    let query = {};

    // اگر کاربر عادی هستی و می‌خوای برنامه‌های خودت رو ببینی (برای صفحه client/program)
    if (myPrograms === "true") {
      query.userId = user.sub;
      query.status = "فعال";
    }
    // اگر مربی هستی، برنامه‌های شاگردت رو ببین
    else if (user.role === "ADMIN" && userId) {
      query.userId = userId;
      query.coachId = user.sub;
    }
    // اگر کاربر عادی هستی، برنامه‌های خودت رو ببین
    else {
      query.userId = user.sub;
    }

    const programs = await WorkoutProgram.find(query)
      .sort({ created_at: -1 })
      .lean();

    console.log("Found programs:", programs.length);

    return NextResponse.json({
      status: "success",
      data: { programs },
    });
  } catch (error) {
    console.error("Error fetching workout programs:", error);
    return NextResponse.json(
      { status: "failed", message: "خطا در دریافت برنامه‌ها" },
      { status: 500 }
    );
  }
}

// POST - ایجاد برنامه جدید
export async function POST(request) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { status: "failed", message: "دسترسی ندارید" },
        { status: 403 }
      );
    }

    const body = await request.json();

    console.log("Creating program for user:", body.userId);
    console.log("Received days data:", JSON.stringify(body.days, null, 2));

    // تبدیل ساختار داده‌ها به فرمت مورد نیاز مدل
    const transformedDays = body.days
      .filter((day) => day.active) // فقط روزهای فعال
      .map((day) => ({
        dayNumber: day.dayNumber,
        dayName: day.dayName,
        active: day.active,
        focus: day.focus || "بدون تمرین",
        exercises: day.exercises.map((exercise) => ({
          exerciseId:
            exercise.exerciseId ||
            exercise.id ||
            `ex_${Date.now()}_${Math.random()}`, // استفاده از ID موجود یا ایجاد جدید
          name: exercise.name,
          name_en: exercise.name_en,
          sets: exercise.sets || 3,
          reps: exercise.reps || "8-12",
          rest: exercise.rest || "60 ثانیه",
          notes: exercise.notes || "",
          order: exercise.order || 0,
        })),
        duration: day.duration || 60,
        notes: day.notes || "",
      }));

    console.log("Transformed days:", JSON.stringify(transformedDays, null, 2));

    // اضافه کردن coachId و تاریخ‌ها
    const programData = {
      title: body.title,
      description: body.description || "",
      userId: body.userId,
      coachId: user.sub,
      duration: body.duration || 4,
      level: body.level || "مبتدی",
      goal: body.goal || "افزایش حجم",
      days: transformedDays,
      startDate: new Date(),
      endDate: new Date(
        Date.now() + (body.duration || 4) * 7 * 24 * 60 * 60 * 1000
      ),
      status: "فعال",
      progress: {
        completedSessions: 0,
        totalSessions: transformedDays.length * (body.duration || 4),
        completionRate: 0,
      },
      settings: {
        includeWarmup: true,
        includeCooldown: true,
        trackWeight: true,
        trackMeasurements: true,
      },
    };

    console.log("Final program data:", JSON.stringify(programData, null, 2));

    const program = await WorkoutProgram.create(programData);

    return NextResponse.json(
      {
        status: "success",
        message: "برنامه تمرینی با موفقیت ایجاد شد",
        data: program,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workout program:", error);

    // نمایش خطاهای دقیق‌تر
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { status: "failed", message: `خطای اعتبارسنجی: ${errors.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: "failed", message: "خطا در ایجاد برنامه" },
      { status: 500 }
    );
  }
}
