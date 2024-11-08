"use client";
import * as React from "react";
import { Season } from "@prisma/client";
import { useQueryState } from "nuqs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn, toUpperCase } from "@/lib/utils";

interface SelectSeasonProps {
  seasons: Season[] | undefined;
}

const SelectSeason: React.FC<SelectSeasonProps> = ({ seasons }) => {
  const [isPending, startTransition] = React.useTransition();
  const [season, setSeason] = useQueryState("season", {
    shallow: false,
    scroll: false,
    startTransition: startTransition,
    clearOnDefault: true,
  });

  const selectedSeason = React.useMemo(() => {
    return seasons?.find(s => s.name === season);
  }, [season, seasons]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between text-white"
          disabled={isPending}
        >
          <span className="truncate mr-2">
            {selectedSeason
              ? toUpperCase(selectedSeason.name)
              : toUpperCase("სეზონი")}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {seasons?.map(season => (
          <DropdownMenuItem
            key={season.id}
            onClick={() => {
              if (selectedSeason?.id === season.id) {
                setSeason(null);
              } else {
                setSeason(season.name);
              }
            }}
            className={cn(selectedSeason?.id === season.id && "bg-accent")}
          >
            {toUpperCase(season.name)}
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          onClick={() => {
            setSeason(null);
          }}
        >
          {toUpperCase("ყველა")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectSeason;
