"use client";
import { Quote } from "@prisma/client";
import * as React from "react";
import { RefreshCcw } from "lucide-react";

interface RandomQuoteListProps {
  data: Quote[];
}

const RandomQuoteList: React.FC<RandomQuoteListProps> = ({ data }) => {
  const [randomQuote, setRandomQuote] = React.useState<Quote | null>(null);
  const [refreshInterval] = React.useState(15000); // 15000 ms to sec = 15 sec
  const intervalRef = React.useRef<NodeJS.Timeout>();

  const handleRefresh = React.useCallback(() => {
    if (data.length > 0) {
      const newQuote = data[Math.floor(Math.random() * data.length)];
      setRandomQuote(newQuote);

      // Clear and reset interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        if (data.length > 0) {
          const newQuote = data[Math.floor(Math.random() * data.length)];
          setRandomQuote(newQuote);
        }
      }, refreshInterval);
    }
  }, [data, refreshInterval]);

  React.useEffect(() => {
    // Set initial random quote and interval
    handleRefresh();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handleRefresh]);

  return (
    <div className="flex items-start gap-2">
      <p className="text-gray-400 italic text-start text-sm min-w-[256px] max-w-[256px]">
        {randomQuote && randomQuote.quote}
      </p>
      {/* countdown */}

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
