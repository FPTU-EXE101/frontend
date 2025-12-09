import { UserSidebar } from "@/components/sidebar/user-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const UserInfoLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UserSidebar/>
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

export default UserInfoLayout;
