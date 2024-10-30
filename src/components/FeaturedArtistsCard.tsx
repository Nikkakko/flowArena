import { toUpperCase } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

interface FeaturedArtistsCardProps {}

const FeaturedArtistsCard: React.FC<FeaturedArtistsCardProps> = ({}) => {
  const i = 1;
  return (
    <div className="bg-secondary rounded-lg p-4 text-center shadow-sm">
      <div className="w-24 h-24 mx-auto mb-4 relative">
        <Image
          src="/placeholder.svg"
          alt={`Artist ${i}`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="font-semibold mb-1">
        {toUpperCase("არტისტის სახელი")}
        {i}
      </h3>
      <p className="text-sm text-gray-400">
        {toUpperCase("მოგებები")}: {i * 5}
      </p>
    </div>
  );
};

export default FeaturedArtistsCard;
