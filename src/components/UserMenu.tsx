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
import {
  Home,
  LogOut,
  StarIcon,
  User,
  User2Icon,
  UserRoundCheckIcon,
} from "lucide-react";
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
          {/* <AvatarImage
            alt={user.name || "User"}
            src={"/assets/default-user.png"}
          /> */}
          <AvatarFallback className="capitalize bg-primary text-white">
            {user.email
              .split(" ")
              .map(n => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col gap-1 bg-secondary"
      >
        <DropdownMenuItem className="cursor-pointer text-white">
          <Link href="/profile" className="flex w-full items-center ">
            <User2Icon className="mr-2 h-4 w-4" />
            <span>{toUpperCase("პროფილი")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-white">
          <Link href="/favorites" className="flex w-full items-center ">
            <StarIcon className="mr-2 h-4 w-4" />
            <span>{toUpperCase("ფავორიტები")}</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem className="cursor-pointer text-white">
            <Link href="/admin" className="flex w-full items-center ">
              <UserRoundCheckIcon className="mr-2 h-4 w-4" />
              <span>{toUpperCase("ადმინ პანელი")}</span>
            </Link>
          </DropdownMenuItem>
        )}
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer text-white">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{toUpperCase("გასვლა")}</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
