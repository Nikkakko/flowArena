"use client";
import { Quote } from "@prisma/client";
import * as React from "react";

interface RandomQuoteListProps {
  data: Quote[];
}

const RandomQuoteList: React.FC<RandomQuoteListProps> = ({ data }) => {
  const [randomQuote, setRandomQuote] = React.useState<Quote | null>(null);

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
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <p className="text-gray-400 italic text-start text-sm max-w-[256px]">
      {randomQuote && randomQuote.quote}
    </p>
  );
};

export default RandomQuoteList;
