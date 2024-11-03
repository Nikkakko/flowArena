import { toUpperCase } from "@/lib/utils";
import { Artist } from "@prisma/client";
import Image from "next/image";
import * as React from "react";

interface FeaturedArtistsCardProps {
  artist: Artist;
}

const FeaturedArtistsCard: React.FC<FeaturedArtistsCardProps> = ({
  artist,
}) => {
  return (
    <div className="bg-secondary rounded-lg p-4 text-center shadow-sm border hover:border-primary transition ">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 relative">
          <Image
            src={artist.image || "/images/artist-placeholder.png"}
            alt={`Artist ${artist.nickName}`}
            fill
            className="rounded-full object-cover grayscale"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold mb-1 text-white">
            {toUpperCase(artist.nickName)}
          </h3>
          <p className="text-sm text-gray-400">
            {toUpperCase("მოგება")}:{" "}
            <span className="text-success">{artist.wins} </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtistsCard;
