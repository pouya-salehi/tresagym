"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import SideBarSkeleton from "../skeletons/SideBarSkeleton";

export default function DashboardSideBar() {
  const [role, setRole] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authRes, pendingCountRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/profile/pending/count"),
        ]);

        const authData = await authRes.json();
        const countData = await pendingCountRes.json();

        if (authRes.ok && authData.user) {
          setRole(authData.user.role);
        }

        if (authData.user?.role === "ADMIN" && countData.success) {
          setPendingCount(countData.count);
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adminLinks = [
    { link: "خانه", path: "/dashboard" },
    {
      link: "شاگردان",
      subLink: [
        { link: "لیست شاگردها", path: "/dashboard/clients" },
        { link: "جزئیات شاگردها", path: "/dashboard/clients-detail" },
        { link: "موارد خاص", path: "/dashboard/special-thing" },
      ],
    },
    { link: "در انتظار تایید", path: "/dashboard/waitings" },
  ];

  const clientLinks = [
    { link: "خانه", path: "/client" },
    { link: "برنامه من", path: "/client/program" },
    { link: "ارسال عکس", path: "/client/image" },
  ];

  const links = role === "ADMIN" ? adminLinks : clientLinks;

  const toggleSubLinks = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // 🔄 Skeleton Loader
  if (loading || role === null) {
    const skeletonCount = 5;
    return (
      <div className="p-4">
        {[...Array(skeletonCount)].map((_, i) => (
          <SideBarSkeleton key={i} width="w-60" height="h-6" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-64">
      <ul>
        {links.map((item, index) => (
          <li key={index} className="relative border-b border-white/10 mb-1">
            {item.subLink ? (
              <div>
                <button
                  onClick={() => toggleSubLinks(index)}
                  className="w-full flex justify-between items-center py-3 px-3 transition hover:bg-amber-400 hover:text-black rounded-md"
                >
                  <span>{item.link}</span>
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openIndex === index && (
                  <ul className="pl-5 pr-2 py-2 border-r border-gray-600 ml-2 mt-1 space-y-1">
                    {item.subLink.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={sub.path}
                          className="block py-2 px-2 rounded-md text-gray-300 hover:text-black hover:bg-amber-400 transition"
                        >
                          {sub.link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.path}
                className="flex justify-between py-3 px-3 rounded-md hover:bg-amber-400 hover:text-black transition"
              >
                {item.link}

                {/* 🔴 Badge برای در انتظار تایید */}
                {item.link === "در انتظار تایید" && pendingCount > 0 && (
                  <span className="top-2 right-3 bg-red-600 text-xs text-white font-bold  px-3 py-1.5 rounded-full shadow-md">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
