"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function BMIForm({
  height: initialHeight,
  weight: initialWeight,
  onComplete,
}) {
  const [height, setHeight] = useState(initialHeight || "");
  const [weight, setWeight] = useState(initialWeight || "");
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      toast.error("قد و وزن معتبر نیست!");
      return;
    }

    const result = w / (h * h);
    setBmi(Number(result.toFixed(1)));
  };

  const handleSubmit = () => {
    if (!bmi || isNaN(bmi)) {
      toast.error("BMI معتبر نیست!");
      return;
    }
    onComplete(bmi);
  };

  return (
    <div className="text-white text-center max-w-md mx-auto w-xs">
      <h3 className="text-lg font-bold mb-4">محاسبه BMI</h3>

      <label className="block mb-2">قد (سانتی‌متر)</label>
      <input
        type="number"
        className="w-full mb-2 p-2 rounded bg-gray-700"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <label className="block mb-2">وزن (کیلوگرم)</label>
      <input
        type="number"
        className="w-full mb-4 p-2 rounded bg-gray-700"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button
        onClick={calculateBMI}
        className="bg-amber-400 px-4 py-2 rounded font-bold mb-4 w-full"
      >
        محاسبه BMI
      </button>

      {bmi && (
        <div className="mt-4">
          <p className="font-bold text-lg">
            BMI شما: <span className="text-amber-400 text-xl">{bmi}</span>
          </p>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 px-4 py-2 rounded w-full text-white font-bold cursor-pointer "
          >
            ثبت و اتمام
          </button>
        </div>
      )}
    </div>
  );
}
