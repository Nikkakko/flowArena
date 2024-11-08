import { Icons } from "@/components/Icons";
import { toUpperGeorgian } from "@/lib/utils";
import {
  HomeIcon,
  MicVocalIcon,
  SwordsIcon,
  TrophyIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";

//youtube instagram, facebook
const links = {
  youtube: "https://www.youtube.com/",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
};

export const siteConfig = {
  name: "FlowArena",
  description: "აღმოაჩინეთ საუკეთესო რეპ ბეთლები და არტისტები",
  welcomeMessage: toUpperGeorgian("მოგესალმებით FlowArena-ზე"),
  navItems: [
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
  ],

  footer: {
    text: toUpperGeorgian(
      `© ${new Date().getFullYear()} FlowArena. ყველა უფლება დაცულია.`
    ),
    socialLinks: [
      {
        title: "Youtube",
        icon: Icons.youtube,
        href: links.youtube,
      },
      {
        title: "Instagram",
        icon: Icons.instagram,
        href: links.instagram,
      },
      {
        title: "Facebook",
        icon: Icons.facebook,
        href: links.facebook,
      },
    ],
  },
};
