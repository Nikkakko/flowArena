import Link from "next/link";
import * as React from "react";
import UserMenu from "./UserMenu";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="flex h-16 items-center  bg-secondary  justify-end p-4 w-full">
      <UserMenu />
    </header>
  );
};

export default Header;
