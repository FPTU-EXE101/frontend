import {
  Home,
  User,
  Heart,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  CreditCard,
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

const userMenuItems = [
  {
    title: "Profile",
    url: "/user/profile",
    icon: User,
    description: "My profile",
  },
  {
    title: "Health Records",
    url: "/user/profile",
    icon: Heart,
    description: "Medical history",
  },
  {
    title: "Appointments",
    url: "/user/profile",
    icon: Calendar,
    description: "Book & manage",
  },
  {
    title: "Prescriptions",
    url: "/user/profile",
    icon: FileText,
    description: "View prescriptions",
  },
  {
    title: "Messages",
    url: "/user/profile",
    icon: MessageSquare,
    description: "Chat with doctors",
  },
  {
    title: "Billing",
    url: "/user/profile",
    icon: CreditCard,
    description: "Payment history",
  },
  {
    title: "Settings",
    url: "/user/profile",
    icon: Settings,
    description: "Account settings",
  },
  {
    title: "Back to Home",
    url: "/user",
    icon: Home,
    description: "Dashboard",
  },
];

export function UserSidebar() {
  return (
    <Sidebar >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
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
