import DashboardSideBar from "@/components/modules/dashboard/DashboardSideBar";

function ClientLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen py-14">
      {/* Sidebar - موبایل: بالا, دسکتاپ: چپ */}
      <div className="w-full lg:w-1/5 lg:min-h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        <aside className="rounded-lg bg-gray-800/50 m-4 lg:m-0 lg:rounded-none lg:h-full">
          <div className="p-4 lg:p-6">
            <DashboardSideBar />
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:w-4/5 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}

export default ClientLayout;
