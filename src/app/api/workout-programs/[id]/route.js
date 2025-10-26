import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/utils/connectDB";
import WorkoutProgram from "@/models/WorkoutProgram";
import mongoose from "mongoose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

async function getUserFromToken(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("No token found");
      return null;
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("User from token:", payload);
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// تابع برای مقایسه ObjectIdها
function compareObjectIds(id1, id2) {
  return id1.toString() === id2.toString();
}

// GET - دریافت برنامه خاص
export async function GET(request, { params }) {
  try {
    // await برای params
    const { id } = await params;
    console.log("GET program request for ID:", id);

    await connectDB();
    const user = await getUserFromToken(request);

    if (!user) {
      console.log("No user found - unauthorized");
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Looking for program with ID:", id);

    const program = await WorkoutProgram.findById(id).lean();

    if (!program) {
      console.log("Program not found with ID:", id);
      return NextResponse.json(
        { status: "failed", message: "برنامه پیدا نشد" },
        { status: 404 }
      );
    }

    console.log("Found program:", {
      programId: program._id,
      programCoachId: program.coachId,
      userId: program.userId,
      userSub: user.sub,
    });

    // بررسی دسترسی کاربر به برنامه - با مقایسه درست ObjectIdها
    const hasAccess =
      compareObjectIds(program.userId, user.sub) ||
      compareObjectIds(program.coachId, user.sub);

    console.log("Access check - hasAccess:", hasAccess);

    if (!hasAccess) {
      console.log("Access denied - user doesn't have permission");
      return NextResponse.json(
        { status: "failed", message: "دسترسی ندارید" },
        { status: 403 }
      );
    }

    console.log("Returning program data successfully");
    return NextResponse.json({
      status: "success",
      data: { program },
    });
  } catch (error) {
    console.error("Error fetching workout program:", error);
    return NextResponse.json(
      { status: "failed", message: "خطا در دریافت برنامه" },
      { status: 500 }
    );
  }
}

// DELETE - حذف برنامه
export async function DELETE(request, { params }) {
  try {
    // await برای params
    const { id } = await params;
    console.log("DELETE program request for ID:", id);

    await connectDB();
    const user = await getUserFromToken(request);

    console.log("User from token:", user);

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // بررسی وجود برنامه
    const program = await WorkoutProgram.findById(id);
    if (!program) {
      return NextResponse.json(
        { status: "failed", message: "برنامه پیدا نشد" },
        { status: 404 }
      );
    }

    console.log("Found program:", {
      programId: program._id.toString(),
      programCoachId: program.coachId.toString(),
      programUserId: program.userId.toString(),
      userSub: user.sub,
      userRole: user.role,
    });

    // بررسی دسترسی - با مقایسه درست ObjectIdها
    const isCoach =
      user.role === "ADMIN" && compareObjectIds(program.coachId, user.sub);
    const isOwner = compareObjectIds(program.userId, user.sub);

    console.log("Access check - isCoach:", isCoach, "isOwner:", isOwner);

    if (!isCoach && !isOwner) {
      console.log("Access denied details:", {
        userRole: user.role,
        isAdmin: user.role === "ADMIN",
        coachMatch: compareObjectIds(program.coachId, user.sub),
        ownerMatch: compareObjectIds(program.userId, user.sub),
      });

      return NextResponse.json(
        { status: "failed", message: "دسترسی ندارید" },
        { status: 403 }
      );
    }

    await WorkoutProgram.findByIdAndDelete(id);

    return NextResponse.json({
      status: "success",
      message: "برنامه با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting workout program:", error);
    return NextResponse.json(
      { status: "failed", message: "خطا در حذف برنامه" },
      { status: 500 }
    );
  }
}

// PUT - ویرایش برنامه
export async function PUT(request, { params }) {
  try {
    // await برای params
    const { id } = await params;
    console.log("PUT program request for ID:", id);

    await connectDB();
    const user = await getUserFromToken(request);

    console.log("User from token (edit):", user);

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // بررسی وجود برنامه
    const existingProgram = await WorkoutProgram.findById(id);
    if (!existingProgram) {
      return NextResponse.json(
        { status: "failed", message: "برنامه پیدا نشد" },
        { status: 404 }
      );
    }

    console.log("Found program for edit:", {
      programId: existingProgram._id.toString(),
      programCoachId: existingProgram.coachId.toString(),
      programUserId: existingProgram.userId.toString(),
      userSub: user.sub,
      userRole: user.role,
    });

    // بررسی دسترسی - با مقایسه درست ObjectIdها
    const isCoach =
      user.role === "ADMIN" &&
      compareObjectIds(existingProgram.coachId, user.sub);
    const isOwner = compareObjectIds(existingProgram.userId, user.sub);

    console.log("Edit access check - isCoach:", isCoach, "isOwner:", isOwner);

    if (!isCoach && !isOwner) {
      console.log("Edit access denied details:", {
        userRole: user.role,
        isAdmin: user.role === "ADMIN",
        coachMatch: compareObjectIds(existingProgram.coachId, user.sub),
        ownerMatch: compareObjectIds(existingProgram.userId, user.sub),
      });

      return NextResponse.json(
        { status: "failed", message: "دسترسی ندارید" },
        { status: 403 }
      );
    }

    // تبدیل ساختار days در صورت وجود
    let updateData = { ...body };
    if (body.days) {
      updateData.days = body.days
        .filter((day) => day.active)
        .map((day) => ({
          dayNumber: day.dayNumber,
          dayName: day.dayName,
          active: day.active,
          focus: day.focus || "بدون تمرین",
          exercises: day.exercises.map((exercise) => ({
            exerciseId:
              exercise.exerciseId ||
              exercise.id ||
              `ex_${Date.now()}_${Math.random()}`,
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

      // به روزرسانی تعداد جلسات
      updateData.progress = {
        ...existingProgram.progress,
        totalSessions:
          updateData.days.length * (body.duration || existingProgram.duration),
      };
    }

    const updatedProgram = await WorkoutProgram.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      status: "success",
      message: "برنامه با موفقیت به روز شد",
      data: updatedProgram,
    });
  } catch (error) {
    console.error("Error updating workout program:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { status: "failed", message: `خطای اعتبارسنجی: ${errors.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: "failed", message: "خطا در به روزرسانی برنامه" },
      { status: 500 }
    );
  }
}
