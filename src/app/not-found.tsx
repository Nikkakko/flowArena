import { Shell } from "@/components/shell";
import { buttonVariants } from "@/components/ui/button";
import { cn, toUpperCase } from "@/lib/utils";

import Link from "next/link";

export default function NotFound() {
  return (
    <Shell variant={"centered"} className="mx-auto">
      <h2 className={cn("text-white font-semibold text-3xl text-center")}>
        {toUpperCase("ვერ მოიძებნა")}
      </h2>

      <p className={cn("text-white/50 text-center text-lg font-semibold")}>
        {toUpperCase("მოთხოვნილი რესურსი ვერ მოიძებნა")}
      </p>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "text-white")}
      >
        {toUpperCase("მთავარი გვერდი")}
      </Link>
    </Shell>
  );
}
