import { SidebarProvider } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/sidebar/manager-sidebar";
import { Outlet } from "react-router-dom";
import ManagerNavbar from "@/components/ui/manager-navbar";

const ManagerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <ManagerSidebar />
        <main className="flex-1">
          <div className="p-4 sm:p-6">
            <ManagerNavbar />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ManagerLayout;
