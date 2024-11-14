"use client";

import UserMenu from "@/components/UserMenu";
import { cn, toUpperCase } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { name: "არტისტები", href: "/admin" },
  { name: "ბეთლები", href: "/admin/battles" },
  { name: "სეზონები", href: "/admin/seasons" },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <header className="flex justify-center gap-4 mt-6">
      {navigationItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={cn(
              "hover:text-primary transition",
              isActive ? "text-primary " : "text-gray-300 "
            )}
          >
            {toUpperCase(item.name)}
          </Link>
        );
      })}
    </header>
  );
}
