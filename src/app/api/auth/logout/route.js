import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ status: "success" });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // منقضی کن
  });
  return res;
}