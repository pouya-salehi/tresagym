// src/app/client/page.jsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import ClientPage from "@/components/templates/ClientPage";
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
  if (user.role === "ADMIN") redirect("/dashboard");

  // 🔹 این خط ارور رو رفع می‌کنه
  const plainUser = JSON.parse(JSON.stringify(user));

  return <ClientPage user={plainUser} />;
}
