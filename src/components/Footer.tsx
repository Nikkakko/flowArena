import { toUpperCase } from "@/lib/utils";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground text-center">
        {toUpperCase("© 2024 FlowFlow Magazine. ყველა უფლება დაცულია.")}
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 transition">
        <Link className="group" href="#">
          <Youtube
            className=" text-muted-foreground group-hover:text-primary-foreground "
            size={24}
          />
        </Link>
        <Link className="group" href="#">
          <Instagram
            className=" text-muted-foreground group-hover:text-primary-foreground "
            size={24}
          />
        </Link>
        <Link className="group" href="#">
          <Facebook
            className=" text-muted-foreground group-hover:text-primary-foreground "
            size={24}
          />
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
