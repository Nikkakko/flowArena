"use client";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Quote } from "@prisma/client";
import { toUpperCase } from "@/lib/utils";

interface ArtistTooltipProps {
  children: React.ReactNode;
  data: Quote[];
}

const ArtistTooltip: React.FC<ArtistTooltipProps> = ({ data, children }) => {
  const [randomQuote, setRandomQuote] = React.useState<Quote | null>(null);

  const handleOpen = React.useCallback(
    (open: boolean) => {
      if (open && data.length > 0) {
        const newQuote = data[Math.floor(Math.random() * data.length)];
        setRandomQuote(newQuote);
      }
    },
    [data]
  );

  // if quote is '' then return children
  const emptyQuote = data.find(quote => quote.quote === "");

  if (data.length === 0 || emptyQuote) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip onOpenChange={handleOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[300px] bg-primary text-white border-primary"
        >
          {randomQuote && toUpperCase(randomQuote.quote)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ArtistTooltip;
