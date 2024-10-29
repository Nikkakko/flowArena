"use client";
import { cn, toUpperCase } from "@/lib/utils";
import { HomeIcon, SwordsIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

//sidebar items : მთავარი,არტისტები,ბეთლები,(battles), ლიდერბორდი
const sidebarItems = [
  {
    title: "მთავარი",
    icon: <HomeIcon />,
    href: "/",
  },

  {
    title: "არტისტები",
    icon: <UsersIcon />,
    href: "/artists",
  },
  {
    title: "ბეთლები",
    icon: <SwordsIcon />,
    href: "/battles",
  },
  {
    title: "ლიდერბორდი",
    icon: <SwordsIcon />,
    href: "/leaderboard",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="hidden lg:flex flex-col min-h-screen  h-full py-4 bg-secondary border-r border-black/50 w-full max-w-[240px]">
      <Link href="/" className="mb-5 mx-auto">
        <Image
          src="/assets/logo.webp"
          alt="logo"
          width={350}
          height={100}
          //blend mode
          className={cn(
            "w-full max-w-[350px] h-full max-h-[200px] object-cover rounded-2xl  hover:opacity-80 transition-all hover:scale-105 "
          )}
          quality={100}
        />
      </Link>

      <nav>
        <ul className="flex flex-col gap-2">
          {sidebarItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-2  rounded-md text-white  px-4 transition-all",
                    isActive && "bg-primary",
                    !isActive && "hover:bg-primary"
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{toUpperCase(item.title)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
// } from "@/components/ui/sidebar";

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader />
//       <SidebarContent>
//         <SidebarGroup />
//         <SidebarGroup />
//       </SidebarContent>
//       <SidebarFooter />
//     </Sidebar>
//   );
// }
