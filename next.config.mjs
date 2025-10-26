/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // اگر از Image استفاده می‌کنی این رو اضافه کن
  images: {
    domains: ["www.weighttraining.guide"], // دامنه‌های عکس‌ها
  },
  // برای API routes
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
