import { cn, toUpperCase } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { buttonVariants } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface LatestBattleCardProps {}

const LatestBattleCard: React.FC<LatestBattleCardProps> = ({}) => {
  const i = 1;
  return (
    <div className="bg-secondary shadow-sm rounded-lg p-4 flex items-center justify-between group">
      <div className="flex items-center">
        <div className="w-16 h-16 relative mr-4">
          <Image
            src="/placeholder.svg"
            alt={`Battle ${i}`}
            fill
            className="rounded object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{toUpperCase("ბეთლი სათაური")}</h3>
          <p className="text-sm text-gray-400">2 {toUpperCase("დღის წინ")}</p>
        </div>
      </div>
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full border-primary text-primary hover:bg-primary hover:text-white max-w-fit"
        )}
        href="/"
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
