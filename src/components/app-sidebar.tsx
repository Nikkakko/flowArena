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
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <SidebarGroup>
          <SidebarHeader className="mb-4">
            <Link href="/">
              <Image
                src="/assets/flowarena-logo.png"
                alt="logo"
                width={201}
                height={112}
                className={cn(
                  "object-cover hover:opacity-80 transition-all hover:scale-105 "
                )}
                quality={80}
                loading="eager"
                priority
                decoding="sync"
              />
              {/* <h1 className="text-white text-2xl font-bold">
                {siteConfig.name}
              </h1> */}
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {siteConfig.navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        prefetch={true}
                        href={item.href}
                        className={cn(
                          "flex items-center py-2  rounded-md text-white  px-4 transition-all",
                          isActive && "bg-primary",
                          !isActive && "hover:bg-primary"
                        )}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon />
                        <span className={cn("ml-2")}>
                          {toUpperCase(item.title)}
                        </span>
                      </Link>
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
