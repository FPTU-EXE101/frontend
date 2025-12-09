import {
  Users,
  Settings,
  LayoutDashboard,
  FileText,
  Shield,
  BarChart,
  Database,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    description: "Overview and statistics",
  },
  {
    title: "User Management",
    url: "/admin",
    icon: Users,
    description: "Manage all users",
  },
  {
    title: "System Reports",
    url: "/admin",
    icon: BarChart,
    description: "View system analytics",
  },
  {
    title: "Database",
    url: "/admin",
    icon: Database,
    description: "Database management",
  },
  {
    title: "Activity Logs",
    url: "/admin",
    icon: Activity,
    description: "System activity logs",
  },
  {
    title: "Security",
    url: "/admin",
    icon: Shield,
    description: "Security settings",
  },
  {
    title: "Documents",
    url: "/admin",
    icon: FileText,
    description: "System documents",
  },
  {
    title: "Settings",
    url: "/admin",
    icon: Settings,
    description: "System configuration",
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
