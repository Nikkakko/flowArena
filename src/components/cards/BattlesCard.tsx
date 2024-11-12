import { cn, toUpperCase } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { buttonVariants } from "../ui/button";
import { Battle } from "@prisma/client";

interface BattlesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  battle: Battle;
}
const BattlesCard: React.FC<BattlesCardProps> = ({ battle, ...props }) => {
  return (
    <div
      className={cn(
        "bg-secondary w-full rounded-lg  overflow-hidden hover:ring-2 hover:ring-primary transition-all shadow-sm group",
        props.className
      )}
    >
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={battle.coverImage}
          alt={battle.title}
          fill
          priority
          sizes="(min-width: 1540px) 501px, (min-width: 1280px) 405px, (min-width: 1040px) 320px, (min-width: 780px) 736px, (min-width: 680px) 608px, (min-width: 420px) 91.67vw, calc(25vw + 268px)"
          className="object-cover grayscale group-hover:grayscale-0 transition-all"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-white">
          {toUpperCase(battle.title)}
        </h3>
        <Link
          prefetch={true}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "lg:w-full border-primary text-primary hover:bg-primary hover:text-white"
          )}
          href={`/battles/${battle.slug}`}
        >
          <div className="flex items-center gap-2">
            {toUpperCase("ნახეთ მეტი")}
            <ChevronRight
              size={20}
              className="transform group-hover:translate-x-1 transition-all"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BattlesCard;
