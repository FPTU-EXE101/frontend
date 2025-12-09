import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/sidebar/manager-sidebar";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ManagerSidebar />
        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ManagerLayout;
