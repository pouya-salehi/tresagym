import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

import connectDB from "@/utils/connectDB";
import Image from "@/models/Image";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

// 🛡 گرفتن اطلاعات کاربر از توکن JWT
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

// ===================== GET =====================
export async function GET(req) {
  try {
    await connectDB();
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    // اگر clientId وجود داره، مربی می‌خواد عکس‌های شاگرد رو ببینه
    // اگر نیست، کاربر عادی می‌خواد عکس‌های خودش رو ببینه
    const targetUserId = clientId || user.sub;

    // پیدا کردن سند Image کاربر هدف
    const imageDoc = await Image.findOne({ userId: targetUserId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      status: "success",
      data: imageDoc || { images: [], status: "draft" },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "failed",
        message: "خطا در دریافت تصاویر",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// ===================== POST =====================
export async function POST(req) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { status: "failed", message: "خطا در اتصال به دیتابیس" },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll("images");
  const categories = formData.getAll("categories");
  const clientId = formData.get("clientId"); // اگر مربی برای شاگرد آپلود می‌کنه

  // تعیین userId - اگر مربی هست برای شاگرد، اگر کاربر عادی هست برای خودش
  const targetUserId = clientId || user.sub;

  if (!files || files.length === 0)
    return NextResponse.json(
      { status: "failed", message: "هیچ تصویری ارسال نشده است" },
      { status: 400 }
    );

  // بررسی تعداد عکس‌ها
  if (files.length > 3) {
    return NextResponse.json(
      { status: "failed", message: "حداکثر ۳ عکس می‌توانید آپلود کنید" },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // آپلود فایل‌ها
  const uploadedImages = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = `/uploads/${fileName}`;
      await writeFile(path.join(uploadDir, fileName), buffer);

      // اضافه کردن اطلاعات عکس
      uploadedImages.push({
        url: filePath,
        category: categories[i] || "front",
        title: `عکس ${categories[i] || "بدن"}`,
        uploadedAt: new Date(),
      });
    }
  }

  // پیدا کردن یا ایجاد سند Image
  let imageDoc = await Image.findOne({ userId: targetUserId });

  if (!imageDoc) {
    // ایجاد سند جدید
    imageDoc = await Image.create({
      userId: targetUserId,
      images: uploadedImages,
      status: uploadedImages.length === 3 ? "completed" : "draft",
    });
  } else {
    // آپدیت سند موجود
    imageDoc.images = [...imageDoc.images, ...uploadedImages];

    // اگر 3 عکس شد، وضعیت رو completed کن
    if (imageDoc.images.length >= 3) {
      imageDoc.status = "completed";
    }

    await imageDoc.save();
  }

  return NextResponse.json(
    {
      status: "success",
      message: "تصاویر با موفقیت آپلود شدند",
      data: imageDoc,
    },
    { status: 201 }
  );
}

// ===================== PATCH =====================
export async function PATCH(req) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { message: "خطا در اتصال به دیتابیس" },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { _id, status } = await req.json();
  if (!_id || !status)
    return NextResponse.json(
      { message: "شناسه یا وضعیت الزامی است" },
      { status: 400 }
    );

  const imageDoc = await Image.findById(_id);
  if (!imageDoc)
    return NextResponse.json({ message: "تصویر یافت نشد" }, { status: 404 });

  // بررسی دسترسی - کاربر فقط می‌تونه عکس‌های خودش رو آپدیت کنه
  if (imageDoc.userId.toString() !== user.sub)
    return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });

  imageDoc.status = status;
  await imageDoc.save();

  return NextResponse.json({
    status: "success",
    message: "وضعیت تصویر بروزرسانی شد",
    data: imageDoc,
  });
}

// ===================== DELETE =====================
export async function DELETE(req) {
  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { message: "خطا در اتصال به دیتابیس" },
      { status: 500 }
    );
  }

  const user = await getUserFromToken(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");
  const clientId = searchParams.get("clientId");

  if (!imageId)
    return NextResponse.json(
      { message: "شناسه تصویر الزامی است" },
      { status: 400 }
    );

  const imageDoc = await Image.findById(imageId);
  if (!imageDoc)
    return NextResponse.json({ message: "تصویر یافت نشد" }, { status: 404 });

  // بررسی دسترسی - کاربر فقط می‌تونه عکس‌های خودش رو حذف کنه
  // یا مربی می‌تونه عکس‌های شاگردش رو حذف کنه
  const isOwner = imageDoc.userId.toString() === user.sub;
  const isCoachForClient = clientId && imageDoc.userId.toString() === clientId;

  if (!isOwner && !isCoachForClient)
    return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });

  // حذف فیزیکی فایل‌ها از uploads/
  for (const img of imageDoc.images) {
    const absPath = path.join(process.cwd(), "public", img.url);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  }

  await Image.deleteOne({ _id: imageId });

  return NextResponse.json({
    status: "success",
    message: "تصویر با موفقیت حذف شد",
  });
}
