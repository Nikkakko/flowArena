"use client";
import * as React from "react";
import { useQueryState } from "nuqs";
import { sortingOptionsArray, sortingLabels } from "@/hooks/use-sorting-params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn, toUpperCase } from "@/lib/utils";

const BattleSorting: React.FC = () => {
  const [isPending, startTransition] = React.useTransition();
  const [sort, setSort] = useQueryState("sort", {
    shallow: false,
    scroll: false,
    startTransition: startTransition,
    clearOnDefault: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between text-white"
          disabled={isPending}
        >
          {sort
            ? toUpperCase(sortingLabels[sort as keyof typeof sortingLabels])
            : toUpperCase(`ბეთლის ტიპი`)}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {sortingOptionsArray.map(option => (
          <DropdownMenuItem
            key={option}
            onClick={() => setSort(option)}
            className={cn("")}
          >
            {toUpperCase(sortingLabels[option])}
          </DropdownMenuItem>
        ))}
        {/* clear sort */}
        <DropdownMenuItem onClick={() => setSort(null)} className={cn("")}>
          {toUpperCase(`ყველა`)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BattleSorting;
