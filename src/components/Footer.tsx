import { siteConfig } from "@/config/site";
import { toUpperCase } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-muted-foreground text-center">
        {toUpperCase(siteConfig.footer.text)}
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 transition">
        {siteConfig.footer.socialLinks.map((link, index) => (
          <Link key={index} href={link.href} className="group">
            {<link.icon />}
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
