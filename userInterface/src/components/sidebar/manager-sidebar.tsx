import {
  LayoutDashboard,
  Users,
  PawPrint,
  Calendar,
  Layers,
  Package,
  MessageSquare,
  CreditCard,
  Zap,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, NavLink} from "react-router-dom";
import { Button } from "@/components/ui/button";

const managerMenuItems = [
  {
    title: "Tổng quan",
    url: "/manager/dashboard",
    icon: LayoutDashboard,
    description: "Bảng tổng quan",
  },
  {
    title: "Khách hàng",
    url: "/manager/customers",
    icon: Users,
    description: "Quản lý khách hàng",
  },
  {
    title: "Thú cưng",
    url: "/manager/pets",
    icon: PawPrint,
    description: "Quản lý thú cưng",
  },
  {
    title: "Lịch hẹn",
    url: "/manager/appointments",
    icon: Calendar,
    description: "Lịch hẹn",
  },
  {
    title: "Dịch vụ",
    url: "/manager/services",
    icon: Layers,
    description: "Dịch vụ",
  },
  {
    title: "Danh mục",
    url: "/manager/categories",
    icon: Package,
    description: "Danh mục sản phẩm",
  },
  {
    title: "Sản phẩm",
    url: "/manager/products",
    icon: Package,
    description: "Quản lý sản phẩm",
  },
  {
    title: "CRM",
    url: "/manager/crm",
    icon: MessageSquare,
    description: "CRM và chăm sóc khách hàng",
  },
  {
    title: "Thanh toán",
    url: "/manager/payments",
    icon: CreditCard,
    description: "Thanh toán và hoá đơn",
  },
  {
    title: "Tự động hóa",
    url: "/manager/automation",
    icon: Zap,
    description: "Quy trình tự động",
  },
  {
    title: "Cài đặt",
    url: "/manager/settings",
    icon: Settings,
    description: "Cấu hình hệ thống",
  },
];

export function ManagerSidebar() {
  

  
  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col gap-4 p-4">
        <div
          
          className="space-y-3    bg-white px-4 py-5 "
        >
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logoPethub.png"
              alt="PetHub"
              className="w-auto max-w-none object-contain h-12 sm:h-12"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
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
            Digital Pet Card
          </p>
          <p className="text-sm leading-6 text-white/90">
            Tạo thẻ điện tử cho thú cưng với QR code, lưu trữ hồ sơ nhanh chóng.
          </p>
          <Button
            asChild
            className="w-full rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-none hover:bg-white/20"
          >
            <Link to="/manager/pets/new">Tạo ngay</Link>
          </Button>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Admin User</p>
              <p className="text-xs text-slate-500">Happy Pets Clinic</p>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Đăng xuất
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
