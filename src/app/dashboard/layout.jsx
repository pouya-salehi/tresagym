import DashboardSideBar from "@/components/modules/dashboard/DashboardSideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-14">
      {/* Sidebar - موبایل: بالا, دسکتاپ: چپ */}
      <div className="w-full lg:w-1/5 lg:min-h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <aside className="p-4 lg:p-6 bg-gray-800/50 lg:bg-transparent lg:h-full">
          <DashboardSideBar />
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:w-4/5 min-h-screen">
        <div className="p-4 lg:p-6 lg:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
