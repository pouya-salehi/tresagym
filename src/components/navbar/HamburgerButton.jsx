"use client";

export default function HamburgerButton({ open, toggle }) {
  return (
    <button
      onClick={toggle}
      className="relative w-8 h-6 flex flex-col justify-between items-center z-[100]"
    >
      {/* خط بالا */}
      <span
        className={`block absolute top-0 left-0 h-[2px] w-full bg-white rounded transition-all duration-500 ease-in-out ${
          open ? "rotate-45 top-[10px]" : "rotate-0 top-0"
        }`}
      ></span>

      {/* خط وسط */}
      <span
        className={`block absolute top-[10px] left-0 h-[2px] w-full bg-white rounded transition-all duration-300 ease-in-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      ></span>

      {/* خط پایین */}
      <span
        className={`block absolute bottom-0 left-0 h-[2px] w-full bg-white rounded transition-all duration-500 ease-in-out ${
          open ? "-rotate-45 bottom-[10px]" : "rotate-0 bottom-0"
        }`}
      ></span>
    </button>
  );
}
