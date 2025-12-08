import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  //   NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  //   NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems: {
  title: string;
  components: { title: string; href: string; description: string }[];
}[] = [
  {
    title: "Getting Started",
    components: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        description:
          "Re-usable components built using Radix UI and Tailwind CSS.",
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "How to install dependencies and structure your app.",
      },
      {
        title: "Typography",
        href: "/docs/typography",
        description: "Styles for headings, paragraphs, lists...etc",
      },
    ],
  },
  {
    title: "Components",
    components: [
      {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content.",
      },
      {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
          "For sighted users to preview content available behind a link.",
      },
      {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
          "Displays an indicator showing the completion progress of a task.",
      },
    ],
  },
  {
    title: "Resources",
    components: [
      {
        title: "Documentation",
        href: "/docs",
        description: "Complete documentation for all components and utilities.",
      },
      {
        title: "Examples",
        href: "/examples",
        description: "Browse through example applications and use cases.",
      },
      {
        title: "GitHub",
        href: "https://github.com",
        description: "View the source code and contribute to the project.",
      },
    ],
  },
  {
    title: "Support",
    components: [
      {
        title: "FAQ",
        href: "/faq",
        description: "Frequently asked questions and answers.",
      },
      {
        title: "Community",
        href: "/community",
        description: "Join our community and get help from other developers.",
      },
      {
        title: "Contact",
        href: "/contact",
        description: "Get in touch with our support team.",
      },
    ],
  },
];

const Navbar = () => {
  return (
    <div className="w-full border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-xl font-bold">Title Project</h2>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.components.map((component) => (
                      <li key={component.title}>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href={component.href}
                          >
                            <div className="text-sm font-medium leading-none">
                              {component.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {component.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
