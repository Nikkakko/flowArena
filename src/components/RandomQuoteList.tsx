"use client";
import { Quote } from "@prisma/client";
import * as React from "react";
import { RefreshCcw } from "lucide-react";

interface RandomQuoteListProps {
  data: Quote[];
  refreshInterval: number;
}

const RandomQuoteList: React.FC<RandomQuoteListProps> = ({
  data,
  refreshInterval,
}) => {
  const [randomQuote, setRandomQuote] = React.useState<Quote | null>(null);

  const handleRefresh = React.useCallback(() => {
    if (data.length > 0) {
      const newQuote = data[Math.floor(Math.random() * data.length)];
      setRandomQuote(newQuote);
    }
  }, [data]);

  React.useEffect(() => {
    // Set initial random quote
    if (data.length > 0) {
      const newQuote = data[Math.floor(Math.random() * data.length)];
      setRandomQuote(newQuote);
    }

    // Set up interval for subsequent updates
    const interval = setInterval(() => {
      if (data.length > 0) {
        const newQuote = data[Math.floor(Math.random() * data.length)];
        setRandomQuote(newQuote);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [data, refreshInterval]);

  return (
    <div className="flex items-start gap-2">
      <p className="text-gray-400 italic text-start text-sm min-w-[256px] max-w-[256px]">
        {randomQuote && randomQuote.quote}
      </p>

      {randomQuote && (
        <button
          onClick={handleRefresh}
          type="button"
          className="text-gray-400 hover:text-gray-300 transition-colors ml-auto group"
        >
          <RefreshCcw
            size={16}
            className="transform group-hover:rotate-180 transition-transform"
          />
        </button>
      )}
    </div>
  );
};

export default RandomQuoteList;
