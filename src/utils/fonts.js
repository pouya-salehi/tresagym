import localFont from "next/font/local";

export const yekan = localFont({
  src: [
    {
      path: "./fonts/YekanBakh-light.woff2", // مسیر درست
      weight: "300",
      style: "normal",
    },
  ],
});

export const title = localFont({
  src: [
    {
      path: "./fonts/Caveat-Medium.ttf", // مسیر درست
      weight: "500", // وزن درست برای Medium
      style: "normal",
    },
  ],
});
