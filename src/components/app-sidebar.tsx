"use client";
import { cn, toUpperCase } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <SidebarGroup>
          <SidebarHeader className="mb-4">
            <Link href="/">
              {/* <Image
                src="/assets/logo.webp"
                alt="logo"
                width={350}
                height={100}
                className={cn(
                  "w-full max-w-[350px] h-[200px] object-cover rounded-2xl  hover:opacity-80 transition-all hover:scale-105 "
                )}
                quality={100}
              /> */}
              <h1 className="text-white text-2xl font-bold">
                {siteConfig.name}
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {siteConfig.navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className={cn(
                          "flex items-center py-2  rounded-md text-white  px-4 transition-all",
                          isActive && "bg-primary",
                          !isActive && "hover:bg-primary"
                        )}
                      >
                        <item.icon />
                        <span className={cn("ml-2")}>
                          {toUpperCase(item.title)}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
