import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/sidebar/staff-sidebar";
import { Outlet } from "react-router-dom";

const StaffLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <StaffSidebar />
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

export default StaffLayout;
