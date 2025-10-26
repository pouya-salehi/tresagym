"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, User, Camera, Calendar, BarChart3, Phone, Mail, CheckCircle } from "lucide-react";
import ClientModalSkeleton from "../../skeletons/ClientModalSkeleton";
import InfoTab from "./InfoTab";
import ImagesTab from "./ImagesTab";
import ProgramTab from "./ProgramTab";
// import ProgressTab from "./modal-tabs/ProgressTab";

export default function ClientModal({ user, onClose, loading }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "اطلاعات کلی", icon: User, color: "blue" },
    { id: "images", label: "عکس‌های ارسالی", icon: Camera, color: "purple" },
    { id: "program", label: "برنامه تمرینی", icon: Calendar, color: "green" },
  ];

  useEffect(() => {
    if (user) {
      const tl = gsap.timeline();
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      ).fromTo(
        modalRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );
    }
  }, [user]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => onClose(),
    });
    tl.to(modalRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.3, ease: "power1.in" },
      "-=0.2"
    );
  };

  if (!user) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-4xl h-screen overflow-hidden"
      >
        {/* هدر مودال */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user.user?.name?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.user?.name || "بدون نام"}
                </h2>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {user.user?.phone}
                  {user.user?.email && (
                    <>
                      <span className="text-gray-600">•</span>
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.user.email}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* نویگیتور */}
          <div className="flex space-x-1 bg-gray-700/50 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/25`
                      : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* محتوای مودال */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <ClientModalSkeleton />
          ) : (
            <div className="animate-fade-in">
              {activeTab === "info" && <InfoTab user={user} />}
              {activeTab === "images" && <ImagesTab userId={user.user?._id} />}
              {activeTab === "program" && <ProgramTab user={user} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}