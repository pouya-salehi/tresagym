import User from "@/models/User";
import { jwtVerify } from "jose";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "please_set_secret"
);

export async function getUserFromToken(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name role phone");
    return user || null;
  } catch {
    return null;
  }
}
