import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json(
      {
        user: {
          id: payload.sub || payload._id || null,
          phone: payload.phone,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
