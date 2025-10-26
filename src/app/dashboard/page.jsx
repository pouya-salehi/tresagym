// src/app/dashboard/page.jsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Server Component
import { jwtVerify } from "jose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import DashboardPage from "@/components/templates/DashboardPage";
import { ClientToast } from "@/components/ClientToast";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export default async function Page() {
  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/signin");

  let payload;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload;
  } catch (err) {
    return <ClientToast message="دسترسی محدود" />;
  }

  const user = await User.findById(payload.sub);
  if (!user) redirect("/signin");

  // 🔐 فقط ادمین دسترسی دارد
  if (user.role !== "ADMIN") redirect("/client");

  // ✅ تبدیل امن برای ارسال به Client Component
  const plainUser = JSON.parse(JSON.stringify(user));

  return <DashboardPage user={plainUser} />;
}
