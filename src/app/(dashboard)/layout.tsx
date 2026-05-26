import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileMenu from "@/components/layout/MobileMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileMenu />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
