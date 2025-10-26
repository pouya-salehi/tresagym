// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname, origin } = req.nextUrl;

  // مسیرهایی که نیاز به لاگین دارن
  const protectedRoutes = ["/checkout", "/profile"];
  const adminRoutes = ["/dashboard"];

  // 🟢 چک برای مسیرهای کاربری
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(`${origin}/signin?auth=required`);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT verify failed:", err.message);
      return NextResponse.redirect(`${origin}/signin?auth=required`);
    }
  }

  // 🔴 چک برای مسیرهای ادمین
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(`${origin}/signin?auth=required`);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(`${origin}/client`);
      }

      console.log("👤 Middleware payload:", payload);
    } catch (err) {
      console.error("JWT verify failed:", err.message);
      return NextResponse.redirect(`${origin}/signin?auth=required`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout",
    "/checkout/:path*",
    "/profile/:path*",
    "/profile",
  ],
};
