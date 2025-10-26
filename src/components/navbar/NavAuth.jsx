"use client"
import Link from "next/link";
//icons
import { CiLogin } from "react-icons/ci";
//auth
import { useAuth } from "@/context/AuthContext";
//ui
import LogoutBtn from "../elements/logoutBtn";
function NavAuth() {
  const { user, logout, loading } = useAuth();
  return (
    <div>
      {user ? (
        <LogoutBtn loader={loading} signOutHandler={logout} />
      ) : (
        <div className="flex items-center gap-2 border-2 rounded-md px-2 py-1 font-bold">
          <Link href="/signin" className="flex items-center gap-1">
            <CiLogin />
            <span className="hidden sm:inline">ورود</span>
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/signup" className="text-sm">
            ثبت نام
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavAuth;
