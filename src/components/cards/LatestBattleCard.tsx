import { cn, toUpperCase } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { buttonVariants } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { Battle } from "@prisma/client";

interface LatestBattleCardProps {
  battle: Battle;
}

const LatestBattleCard: React.FC<LatestBattleCardProps> = ({ battle }) => {
  const i = 1;
  return (
    <div className="bg-secondary shadow-sm rounded-lg p-4 flex flex-col lg:flex-row items-end lg:items-center justify-between group">
      <div className="flex items-center w-full">
        <div className="hidden lg:block w-[120px] h-16 relative mr-4 rounded overflow-hidden">
          <Image
            src={battle.coverImage}
            alt={battle.title}
            fill
            sizes="98px"
            className=" object-cover"
          />
        </div>
        <div className="flex  lg:flex-col w-full justify-between lg:justify-normal">
          <h3 className="font-semibold text-white">
            {toUpperCase(battle.title)}
          </h3>
          <p className="text-sm text-gray-400">2 {toUpperCase("დღის წინ")}</p>
        </div>
      </div>
      <Link
        className={cn(
          buttonVariants({ variant: "outline", className: "px-2 lg:px-4" }),
          "w-full mt-2 lg:mt-0 justify-start border-primary text-primary hover:bg-primary hover:text-white max-w-fit"
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
  );
};

export default LatestBattleCard;
