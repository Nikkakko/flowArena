import { cn, toUpperCase } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { buttonVariants } from "./ui/button";
import { Battle } from "@prisma/client";

interface BattlesCardProps {
  battle: Battle;
}

const BattlesCard: React.FC<BattlesCardProps> = ({ battle }) => {
  const i = 1;
  return (
    <div className="bg-secondary rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all shadow-sm group">
      <div className="aspect-video relative h-[279px]">
        <Image
          src={battle.coverImage}
          alt={battle.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-white">
          {toUpperCase(battle.title)}
        </h3>
        <p className="text-gray-400 mb-4">
          {toUpperCase("ნახეთ უახლესი ბეთლი ორ საუკეთესო არტისტს შორის")}
        </p>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full border-primary text-primary hover:bg-primary hover:text-white"
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
