"use client";
import { useRef, useEffect } from "react";

function OtpInputs({ value, onChange, length = 6 }) {
  const inputs = useRef([]);

  // وقتی لود شد روی اولین input فوکوس بشه
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const digit = e.target.value.replace(/\D/g, ""); // فقط عدد
    const newValue = value.split("").slice(0, length);
    newValue[index] = digit;
    const joined = newValue.join("");
    onChange(joined);

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center py-2" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-10 h-12 rounded-md text-gray-500 font-bold bg-gray-100 text-center text-lg"
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}

export default OtpInputs;
