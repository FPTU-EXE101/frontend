import { LayoutDashboard, UserPlus, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getCurrentUserName, logout } from "@/lib/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Tổng quan hệ thống",
  },
  {
    title: "Tạo Manager",
    url: "/admin/managers/new",
    icon: UserPlus,
    description: "Tạo tài khoản Manager",
  },
  {
    title: "Quản lý Manager",
    url: "/admin/managers",
    icon: Users,
    description: "Quản lý tài khoản Manager",
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const adminName = getCurrentUserName() || "Admin User";

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col gap-4 p-4">
        <div className="space-y-3 bg-white px-4 py-5">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logoPethub.png"
              alt="PetHub"
              className="h-12 w-auto max-w-none object-contain sm:h-12"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className={({ isActive }) =>
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition duration-200 " +
                      (isActive
                        ? "bg-[#F5D7D2] text-[#9B2F25]"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950")
                    }
                    title={item.description}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="space-y-4 rounded-[2rem] bg-gradient-to-br from-[#D56756] to-[#B24C40] p-5 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Admin Panel
          </p>
          <p className="text-sm leading-6 text-white/90">
            Quản lý tài khoản Manager và quyền vận hành cửa hàng trên PetHub.
          </p>
          <Button
            asChild
            className="w-full rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-none hover:bg-white/20"
          >
            <Link to="/admin/managers/new">Tạo Manager</Link>
          </Button>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {adminName}
              </p>
              <p className="text-xs text-slate-500">System Admin</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={handleLogout}
              type="button"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
