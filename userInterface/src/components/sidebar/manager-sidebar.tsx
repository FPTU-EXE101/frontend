import {
  Users,
  Calendar,
  LayoutDashboard,
  FileText,
  ClipboardList,
  TrendingUp,
  Target,
  Briefcase,
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

const managerMenuItems = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    title: "Team Management",
    url: "/manager",
    icon: Users,
    description: "Manage team members",
  },
  {
    title: "Projects",
    url: "/manager",
    icon: Briefcase,
    description: "Project overview",
  },
  {
    title: "Tasks",
    url: "/manager",
    icon: ClipboardList,
    description: "Task management",
  },
  {
    title: "Schedule",
    url: "/manager",
    icon: Calendar,
    description: "Team schedule",
  },
  {
    title: "Performance",
    url: "/manager",
    icon: TrendingUp,
    description: "Performance metrics",
  },
  {
    title: "Goals",
    url: "/manager",
    icon: Target,
    description: "Team goals",
  },
  {
    title: "Reports",
    url: "/manager",
    icon: FileText,
    description: "Generate reports",
  },
];

export function ManagerSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manager Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerMenuItems.map((item) => (
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
