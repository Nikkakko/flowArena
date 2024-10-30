import Link from "next/link";
import * as React from "react";
import UserMenu from "./UserMenu";
import { SidebarTrigger } from "./ui/sidebar";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="flex h-16 items-center  bg-secondary  justify-between p-4 w-full">
      <SidebarTrigger className="text-white" />
      <UserMenu />
    </header>
  );
};

export default Header;
