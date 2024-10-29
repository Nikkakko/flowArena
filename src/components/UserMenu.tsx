"use client";
import * as React from "react";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Home, LogOut, User } from "lucide-react";
import { signOut } from "@/app/(login)/_actions";
import { cn, toUpperCase } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  if (!user)
    return (
      <Link
        href={"/sign-in"}
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          "text-white"
        )}
      >
        <div className="flex items-center gap-2">
          <User />
          {toUpperCase("შესვლა")}
        </div>
      </Link>
    );
  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage
            alt={user.name || "User"}
            src={"/assets/default-user.png"}
          />
          <AvatarFallback className="capitalize">
            {user.email
              .split(" ")
              .map(n => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
