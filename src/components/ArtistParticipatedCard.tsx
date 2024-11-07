import { toUpperCase } from "@/lib/utils";
import { Battle } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

interface ArtistParticipatedCardProps {
  battle: Battle & {
    season: {
      name: string;
    };
  };
  artistId: string;
}

const ArtistParticipatedCard: React.FC<ArtistParticipatedCardProps> = ({
  battle,
  artistId,
}) => {
  return (
    <Link
      prefetch={true}
      href={`/battles/${battle.slug}`}
      key={battle.id}
      className="bg-secondary/50 p-4 rounded-lg border border-secondary hover:border-primary transition flex justify-between items-center group"
    >
      <div className="flex gap-4 items-center">
        <div className="relative w-32 h-16 rounded-lg overflow-hidden">
          <Image
            src={battle.coverImage || "/assets/battle-placeholder.webp"}
            alt={battle.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-white font-medium group-hover:text-primary transition mb-1">
            {battle.title}
          </p>
          {/* season */}
          <p className="text-xs text-gray-500">
            {toUpperCase(battle.season.name)}
          </p>

          <p className="text-xs text-gray-500">
            {toUpperCase(battle.type === "ACAPELLA" ? "აკაპელა" : "ფლოუ")}
          </p>
        </div>
      </div>
      <div className="text-sm">
        {battle.status === "COMPLETED" ? (
          battle.winnerId === artistId ? (
            <span className="text-success px-3 py-1 rounded-full bg-success/10">
              {toUpperCase("მოგებული")}
            </span>
          ) : (
            <span className="text-destructive px-3 py-1 rounded-full bg-destructive/10">
              {toUpperCase("წაგებული")}
            </span>
          )
        ) : (
          <span className="text-primary px-3 py-1 rounded-full bg-primary/10">
            {toUpperCase(battle.status)}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ArtistParticipatedCard;
