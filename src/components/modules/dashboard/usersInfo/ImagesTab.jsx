"use client";
import { useState, useEffect } from "react";
import {
  Camera,
  Plus,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function ImagesTab({ userId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDoc, setImageDoc] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserImages();
    }
  }, [userId]);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // اضافه کردن clientId به query string برای دریافت عکس‌های شاگرد
      const response = await fetch(`/api/images?clientId=${userId}`);
      const data = await response.json();

      console.log("API Response:", data); // برای دیباگ

      if (data.status === "success") {
        setImageDoc(data.data);
        setImages(data.data.images || []);
      } else {
        setError(data.message || "خطا در دریافت عکس‌ها");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewImage = () => {
    // منطق درخواست عکس جدید
    console.log("Request new image for user:", userId);
    // می‌تونی اینجا یه notification برای کاربر بفرستی
    alert(`درخواست عکس جدید برای شاگرد ارسال شد`);
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("آیا از حذف این عکس مطمئنید؟")) return;

    try {
      const response = await fetch(
        `/api/images?imageId=${imageId}&clientId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // رفرش لیست عکس‌ها
        await fetchUserImages();
      } else {
        alert(data.message || "خطا در حذف عکس");
      }
    } catch (err) {
      alert("خطا در حذف عکس");
      console.error("Delete error:", err);
    }
  };

  const handleDeleteAllImages = async () => {
    if (!imageDoc?._id) return;

    if (!confirm("آیا از حذف همه عکس‌های این شاگرد مطمئنید؟")) return;

    try {
      const response = await fetch(
        `/api/images?imageId=${imageDoc._id}&clientId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setImages([]);
        setImageDoc(null);
      } else {
        alert(data.message || "خطا در حذف عکس‌ها");
      }
    } catch (err) {
      alert("خطا در حذف عکس‌ها");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">عکس‌های ارسالی</h3>
          <div className="h-10 bg-gray-700 rounded-xl w-40 animate-pulse"></div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600 animate-pulse"
            >
              <div className="aspect-square bg-gray-600 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <div className="text-red-400 text-lg mb-2">خطا در بارگذاری عکس‌ها</div>
        <div className="text-gray-400 text-sm mb-4">{error}</div>
        <button
          onClick={fetchUserImages}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر و دکمه‌ها */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">عکس‌های ارسالی</h3>
          <p className="text-gray-400 text-sm mt-1">
            {images.length} عکس (
            {imageDoc?.status === "completed" ? "تکمیل شده" : "در حال انتظار"})
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchUserImages}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            title="رفرش"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRequestNewImage}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            درخواست عکس جدید
          </button>
        </div>
      </div>

      {/* وضعیت کلی */}
      {imageDoc && (
        <div
          className={`p-4 rounded-2xl border ${
            imageDoc.status === "completed"
              ? "bg-green-500/10 border-green-500/30"
              : "bg-yellow-500/10 border-yellow-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            {imageDoc.status === "completed" ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-400" />
            )}
            <div>
              <h4 className="font-bold text-white">
                {imageDoc.status === "completed"
                  ? "تکمیل شده"
                  : "در حال انتظار"}
              </h4>
              <p className="text-gray-400 text-sm">
                {imageDoc.status === "completed"
                  ? "شاگر همه عکس‌های مورد نیاز را ارسال کرده است"
                  : "شاگرد باید عکس‌های باقی‌مانده را ارسال کند"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* لیست عکس‌ها */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-700/30 rounded-2xl border border-gray-600">
          <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-400 mb-2">
            هیچ عکسی یافت نشد
          </h4>
          <p className="text-gray-500 text-sm">
            شاگرد هنوز عکسی آپلود نکرده است
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <ImageCard
                key={image._id || index}
                image={image}
                onDelete={() => handleDeleteImage(imageDoc?._id)}
              />
            ))}
          </div>

          {/* دکمه حذف همه */}
          <div className="flex justify-end pt-4 border-t border-gray-700">
            <button
              onClick={handleDeleteAllImages}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف همه عکس‌ها
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// کامپوننت کارت عکس
function ImageCard({ image, onDelete }) {
  const getCategoryLabel = (category) => {
    const labels = {
      front: "نمای جلو",
      side: "نمای پهلو",
      back: "نمای پشت",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      front: "blue",
      side: "green",
      back: "purple",
    };
    return colors[category] || "gray";
  };

  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

  return (
    <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600 hover:border-purple-500/50 transition-all group">
      {/* تصویر */}
      <div className="aspect-square bg-gray-600 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
        {image.url ? (
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <Camera className="w-12 h-12 text-gray-400" />
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
          <button
            onClick={() => window.open(image.url, "_blank")}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            title="مشاهده کامل"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => {
              if (image.url) {
                const link = document.createElement("a");
                link.href = image.url;
                link.download = `image-${image.category}.jpg`;
                link.click();
              }
            }}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            title="دانلود"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full transition-colors"
            title="حذف"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* اطلاعات */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-white text-sm">
            {image.title || getCategoryLabel(image.category)}
          </h4>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              colorClasses[getCategoryColor(image.category)]
            }`}
          >
            {getCategoryLabel(image.category)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">
            {image.uploadedAt
              ? new Date(image.uploadedAt).toLocaleDateString("fa-IR")
              : "---"}
          </span>

          <div className="flex items-center gap-1">
            {image.status === "completed" ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-400" />
            )}
            <span
              className={`text-xs ${
                image.status === "completed"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {image.status === "completed" ? "تکمیل شده" : "در انتظار"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
