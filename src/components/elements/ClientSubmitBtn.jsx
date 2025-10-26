"use client";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

function ClientSubmitBtn({ text = "ارسال", onClick }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (onClick) {
      setLoading(true);
      await onClick(e);
      setLoading(false);
    }
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      disabled={loading}
      className="bg-amber-400 hover:bg-amber-500 transition text-black font-bold px-4 py-2 rounded w-full flex justify-center items-center cursor-pointer"
    >
      {loading ? <BeatLoader size={8} color="#000" /> : text}
    </button>
  );
}

export default ClientSubmitBtn;
