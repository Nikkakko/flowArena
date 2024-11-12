import { toUpperCase } from "@/lib/utils";
import { Battle } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface ArtistParticipatedCardProps {
  battle: Battle & {
    season: {
      name: string;
    } | null;
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
      className="bg-secondary/50 p-4 rounded-lg border border-secondary hover:border-primary transition flex justify-between items-start lg:items-center group"
    >
      <div className="flex gap-4 items-center">
        <div className="hidden lg:block relative w-32 h-16 rounded-lg overflow-hidden">
          <Image
            src={battle.coverImage || "/assets/battle-placeholder.webp"}
            alt={battle.title}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-white font-medium group-hover:text-primary transition mb-1">
            {battle.title}
          </p>
          {/* season */}
          <p className="text-xs text-gray-500">
            {toUpperCase(battle.season?.name || "სეზონი არ მოიძებნა")}
          </p>

          <p className="text-xs text-gray-500">
            {toUpperCase(battle.type === "ACAPELLA" ? "აკაპელა" : "ფლოუ")}
          </p>
        </div>
      </div>

      <div className="text-sm ">
        {battle.status === "COMPLETED" ? (
          battle.winnerId === null ? (
            <Badge variant="secondary">{toUpperCase("არ შეფასებულა")}</Badge>
          ) : battle.winnerId === artistId ? (
            <Badge variant="success">{toUpperCase("მოგებული")}</Badge>
          ) : (
            <Badge variant="destructive">{toUpperCase("წაგებული")}</Badge>
          )
        ) : (
          <Badge>{toUpperCase(battle.status)}</Badge>
        )}
      </div>
    </Link>
  );
};

export default ArtistParticipatedCard;
