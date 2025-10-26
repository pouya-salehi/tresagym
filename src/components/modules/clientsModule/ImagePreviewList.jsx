"use client";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { BarLoader } from "react-spinners";
import { CiCircleCheck } from "react-icons/ci";
import Image from "next/image";

function ImagePreviewList({ profileData, setProfileData }) {
  const [uploadStatus, setUploadStatus] = useState([]);

  useEffect(() => {
    if (!profileData?.images) return;

    const newStatus = profileData.images.map(() => "loading");
    setUploadStatus(newStatus);

    const timers = profileData.images.map(
      (_, i) =>
        setTimeout(() => {
          setUploadStatus((prev) => {
            const copy = [...prev];
            copy[i] = "success";
            return copy;
          });
        }, 1000) // کاهش زمان برای UX بهتر
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [profileData.images]);

  const addHandler = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProfileData({
        ...profileData,
        images: [...(profileData.images || []), ...files],
      });
    }
  };

  const deleteHandler = (index) => {
    const newList = [...profileData.images];
    newList.splice(index, 1);
    setProfileData({ ...profileData, images: newList });
    // آپدیت وضعیت هم
    setUploadStatus((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      <p className="font-bold">عکس‌های انتخاب شده</p>

      {!profileData.images || profileData.images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <MdOutlineLibraryAdd className="mx-auto text-3xl mb-2" />
          <p className="">هنوز عکسی انتخاب نشده</p>
          <p className="text-sm mt-1">
            برای انتخاب عکس کلیک کنید
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-4">
        {profileData.images?.map((img, index) => {
          const url = img instanceof File ? URL.createObjectURL(img) : img;
          const status = uploadStatus[index];

          return (
            <div
              key={index}
              className={`relative w-28 h-28 rounded-xl overflow-hidden border-2 transition-all ${
                status === "loading"
                  ? "border-blue-400 bg-blue-50"
                  : status === "success"
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <Image
                width={112}
                height={112}
                src={url}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />

              {/* Loading/Success Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                {status === "loading" && (
                  <div className="text-white text-center">
                    <BarLoader width={40} color="#fff" />
                    <p className="text-xs mt-1">در حال پردازش...</p>
                  </div>
                )}
                {status === "success" && (
                  <CiCircleCheck className="w-8 h-8 text-green-400 bg-white rounded-full" />
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteHandler(index)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full shadow-lg p-1.5 transition-all hover:scale-110"
                title="حذف عکس"
              >
                <AiOutlineDelete className="text-rose-500 w-4 h-4" />
              </button>

              {/* File Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                {img.name || `عکس ${index + 1}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Button - فقط اگر کمتر از 3 عکس هست */}
      {(profileData.images?.length || 0) < 3 && (
        <label className="flex items-center bg-blue-500 text-white font-medium text-sm gap-2 justify-center p-3 rounded-lg w-full cursor-pointer hover:bg-blue-600 transition">
          <MdOutlineLibraryAdd className="text-lg" />
          افزودن عکس ({profileData.images?.length || 0}/3)
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={addHandler}
          />
        </label>
      )}
    </div>
  );
}

export default ImagePreviewList;
