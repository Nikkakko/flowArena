"use client";
import { cn, toUpperCase } from "@/lib/utils";
import {
  HomeIcon,
  MicVocalIcon,
  SwordsIcon,
  TrophyIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
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

const items = [
  {
    title: "მთავარი",
    icon: HomeIcon,
    href: "/",
  },

  {
    title: "არტისტები",
    icon: MicVocalIcon,
    href: "/artists",
  },
  {
    title: "ბეთლები",
    icon: SwordsIcon,
    href: "/battles",
  },
  {
    title: "ლიდერბორდი",
    icon: TrophyIcon,
    href: "/leaderboard",
  },
  {
    title: "ჩვენს შესახებ",
    icon: UsersRoundIcon,
    href: "/about",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // return (
  //   <aside className="hidden lg:flex flex-col  min-h-screen   py-4 bg-secondary border-r border-black/50 w-full max-w-[240px]">
  //     <Link href="/" className="mb-5 mx-auto">
  //       <Image
  //         src="/assets/logo.webp"
  //         alt="logo"
  //         width={350}
  //         height={100}
  //         className={cn(
  //           "w-full max-w-[350px] h-full max-h-[200px] object-cover rounded-2xl  hover:opacity-80 transition-all hover:scale-105 "
  //         )}
  //         quality={100}
  //       />
  //     </Link>

  //     <nav>
  //       <ul>
  //         {items.map(item => {
  //           const isActive = pathname === item.href;
  //           return (
  //             <li key={item.title}>
  //               <Link
  //                 href={item.href}
  //                 className={cn(
  //                   "flex items-center py-2  rounded-md text-white  px-4 transition-all",
  //                   isActive && "bg-primary",
  //                   !isActive && "hover:bg-primary"
  //                 )}
  //               >
  //                 <item.icon />
  //                 <span className="ml-2">{toUpperCase(item.title)}</span>
  //               </Link>
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     </nav>
  //   </aside>
  // );

  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <SidebarGroup>
          <SidebarHeader className="mb-4">
            <Link href="/">
              <Image
                src="/assets/logo.webp"
                alt="logo"
                width={350}
                height={100}
                className={cn(
                  "w-full max-w-[350px] h-[200px] object-cover rounded-2xl  hover:opacity-80 transition-all hover:scale-105 "
                )}
                quality={100}
              />
            </Link>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
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
