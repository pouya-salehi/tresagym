"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoRefreshOutline } from "react-icons/io5";
import { Trash2, Eye, CheckCircle } from "lucide-react";
import ImagePreviewList from "../ImagePreviewList";
import { useConfirm } from "@/context/ConfirmProvider";
export default function ImagesPage() {
  const confirm = useConfirm();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [imageData, setImageData] = useState({
    images: [],
    status: "draft",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 🧩 گرفتن عکس‌ها از سرور
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoader(true);
    try {
      const res = await fetch("/api/images", { method: "GET" });
      const data = await res.json();
      if (data.status === "success") {
        setImageData(data.data);
      } else {
        toast.error(data.message || "خطا در دریافت تصاویر");
      }
    } catch (err) {
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoader(false);
    }
  };

  // 📁 انتخاب فایل - با ImagePreviewList هماهنگ
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // بررسی تعداد عکس‌ها
    const totalImages = (imageData.images?.length || 0) + files.length;
    if (totalImages > 3) {
      toast.error("حداکثر ۳ عکس می‌توانید آپلود کنید");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // 📤 ارسال عکس‌ها به سرور
  const uploadHandler = async () => {
    if (!selectedFiles.length) {
      toast.error("هیچ تصویری انتخاب نشده است");
      return;
    }

    setLoader(true);
    const formData = new FormData();

    // اضافه کردن فایل‌ها و دسته‌بندی‌ها
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
      const categories = ["front", "side", "back"];
      formData.append("categories", categories[index] || "front");
    });

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        toast.success("تصاویر با موفقیت آپلود شدند");
        setSelectedFiles([]);
        fetchImages(); // رفرش داده‌ها

        // اگر 3 عکس شد، اتوماتیک ثبت نهایی کن
        if (data.data.images.length === 3) {
          setTimeout(() => {
            submitFinal();
          }, 1000);
        }
      } else {
        toast.error(data.message || "خطا در آپلود تصاویر");
      }
    } catch {
      toast.error("مشکل در ارسال درخواست به سرور");
    } finally {
      setLoader(false);
    }
  };

  // ✅ ثبت نهایی عکس‌ها
  const submitFinal = async () => {
    if (!imageData._id) return;

    try {
      const res = await fetch("/api/images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: imageData._id,
          status: "completed",
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(
          "✅ عکس‌ها با موفقیت ثبت نهایی شدند و برای مربی ارسال شدند"
        );
        fetchImages();
      }
    } catch {
      toast.error("خطا در ثبت نهایی");
    }
  };

  // ❌ حذف عکس
  const deleteImage = async (imageId) => {
    const isConfirmed = await confirm(
      "حذف عکس ها",
      `آیا از حذف عکس های خود مطمئن هستید؟`,
      "danger"
    );
    if (isConfirmed) {
      try {
        const res = await fetch("/api/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId }),
        });
        const data = await res.json();
        if (data.status === "success") {
          toast.success("عکس‌ها حذف شدند");
          fetchImages();
        } else toast.error(data.message);
      } catch {
        toast.error("خطا در حذف عکس‌ها");
      }
    }
  };

  // حذف فایل از لیست انتخابی
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />

      {/* هدر صفحه */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">آپلود عکس‌های بدن</h2>
      </div>

      {/* 📤 بخش آپلود عکس‌های جدید */}
      <div className="rounded-xl shadow p-6 mb-10">
        <ImagePreviewList
          profileData={{ images: selectedFiles }}
          setProfileData={(data) => setSelectedFiles(data.images || [])}
        />

        {/* دکمه آپلود */}
        <button
          onClick={uploadHandler}
          disabled={loader || selectedFiles.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg mt-4 hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full justify-center"
        >
          {loader ? (
            <>
              <IoRefreshOutline className="animate-spin text-xl" />
              در حال آپلود...
            </>
          ) : (
            <>
              <AiOutlineCloudUpload className="text-xl" />
              آپلود عکس‌ها ({selectedFiles.length})
            </>
          )}
        </button>

        {/* راهنما */}
        <div className="mt-4 bg-sky-50 rounded-lg p-3">
          <p className="text-blue-800 text-sm font-medium">راهنما:</p>
          <ul className="text-blue-700 text-xs mt-1 space-y-1">
            <li>• حداکثر ۳ عکس می‌توانید آپلود کنید</li>
            <li>• عکس‌ها باید از زوایای مختلف بدن باشد</li>
            <li>• پس از آپلود ۳ عکس، به طور خودکار ثبت نهایی می‌شوند</li>
          </ul>
        </div>
      </div>

      {/* 🖼 نمایش عکس‌های ذخیره‌شده */}
      <div className="rounded-md shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-600">عکس‌های آپلود شده</h3>

          {/* وضعیت */}
          {imageData.status === "completed" && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">ثبت نهایی شده</span>
            </div>
          )}
        </div>

        {loader ? (
          <div className="flex justify-center py-8">
            <IoRefreshOutline className="animate-spin text-2xl text-gray-400" />
          </div>
        ) : !imageData.images || imageData.images.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <p className="text-gray-500">هنوز هیچ عکسی آپلود نشده است.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* گرید عکس‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {imageData.images.map((img, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden group relative hover:border-green-500 transition-all duration-300"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-52 object-cover"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300">
                    <button
                      onClick={() => window.open(img.url, "_blank")}
                      className="bg-white p-3 rounded-full hover:bg-blue-50 transition transform hover:scale-110"
                      title="مشاهده کامل"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {/* اطلاعات عکس */}
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {img.title}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(img.uploadedAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          img.category === "front"
                            ? "bg-blue-100 text-blue-800"
                            : img.category === "side"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {img.category === "front"
                          ? "جلو"
                          : img.category === "side"
                          ? "پهلو"
                          : "پشت"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* دکمه‌های اقدام */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {imageData.images.length === 3 &&
                imageData.status === "draft" && (
                  <button
                    onClick={submitFinal}
                    className="flex items-center gap-2 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    ثبت نهایی و ارسال به مربی
                  </button>
                )}

              {/* دکمه حذف کل مجموعه */}
              <button
                onClick={() => deleteImage(imageData._id)}
                className="flex items-center gap-2 bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700 transition font-medium cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                حذف همه عکس‌ها
              </button>
            </div>

            {/* پیام تکمیل شده */}
            {imageData.status === "completed" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    ✅ عکس‌های شما با موفقیت ثبت شدند و برای مربی ارسال شدند
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
