"use client";
import { useState } from "react";
import ClientSubmitBtn from "@/components/elements/ClientSubmitBtn";
import toast, { Toaster } from "react-hot-toast";

export default function ProfileForm({ form, setForm, onComplete }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.height || !form.weight) {
      toast.error("لطفا قد و وزن را وارد کنید");
      return;
    }
    onComplete({
      ...form,
      height: Number(form.height),
      weight: Number(form.weight),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg text-white shadow-lg w-lg"
    >
      <h3 className="text-lg font-bold mb-4 text-center">تکمیل اطلاعات</h3>

      <label>کد ملی</label>
      <input
        type="text"
        className="w-full bg-gray-700 p-2 rounded mb-3"
        value={form.idNumber}
        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
        required
      />

      <label>جنسیت</label>
      <select
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
        className="w-full bg-gray-700 p-2 rounded mb-3"
      >
        <option value="male">مرد</option>
        <option value="female">زن</option>
      </select>

      <label>قد</label>
      <input
        type="number"
        value={form.height}
        onChange={(e) => setForm({ ...form, height: e.target.value })}
        className="w-full bg-gray-700 p-2 rounded mb-3"
        required
      />

      <label>وزن</label>
      <input
        type="number"
        value={form.weight}
        onChange={(e) => setForm({ ...form, weight: e.target.value })}
        className="w-full bg-gray-700 p-2 rounded mb-3"
        required
      />

      <label>توضیحات اضافی</label>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full bg-gray-700 p-2 rounded mb-4 resize-none"
        placeholder="در صورت وجود مشکل خاص توضیح دهید"
      />

      <ClientSubmitBtn text="ذخیره و ادامه" />
    </form>
  );
}
