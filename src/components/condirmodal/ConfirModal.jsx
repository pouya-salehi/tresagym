"use client";
import { useEffect } from "react";
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "warning", // warning, danger, info, success
}) {
  // جلوگیری از اسکرول وقتی مدال بازه
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // هندلر کلیک روی backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  // هندلر کلید Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // استایل‌ها بر اساس نوع مدال
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      confirmButton: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    danger: {
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      confirmButton: "bg-red-500 hover:bg-red-600 text-white",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      confirmButton: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      confirmButton: "bg-green-500 hover:bg-green-600 text-white",
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-md w-full ${config.bgColor} border ${config.borderColor} transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* محتوا */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed text-right">{message}</p>
        </div>

        {/* فوتر - دکمه‌ها */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            لغو
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-white transition-all duration-200 font-semibold shadow-sm hover:shadow-md ${config.confirmButton}`}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
