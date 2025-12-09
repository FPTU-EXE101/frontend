import {
  Home,
  ClipboardList,
  Calendar,
  MessageSquare,
  FileText,
  User,
  Clock,
  Bell,
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

const staffMenuItems = [
  {
    title: "Home",
    url: "/staff",
    icon: Home,
    description: "Dashboard",
  },
  {
    title: "My Tasks",
    url: "/staff",
    icon: ClipboardList,
    description: "View assigned tasks",
  },
  {
    title: "Timesheet",
    url: "/staff",
    icon: Clock,
    description: "Track work hours",
  },
  {
    title: "Schedule",
    url: "/staff",
    icon: Calendar,
    description: "My schedule",
  },
  {
    title: "Messages",
    url: "/staff",
    icon: MessageSquare,
    description: "Team communication",
  },
  {
    title: "Notifications",
    url: "/staff",
    icon: Bell,
    description: "Recent notifications",
  },
  {
    title: "Documents",
    url: "/staff",
    icon: FileText,
    description: "Work documents",
  },
  {
    title: "Profile",
    url: "/staff",
    icon: User,
    description: "My profile",
  },
];

export function StaffSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Staff Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staffMenuItems.map((item) => (
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
