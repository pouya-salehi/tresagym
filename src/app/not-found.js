import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
      <h1 className="text-8xl font-bold">404</h1>
      <p className="text-lg mt-4">صفحه مورد نظر پیدا نشد!</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
