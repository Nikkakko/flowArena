import { Artist } from "@prisma/client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BattleArtistCardProps {
  artist: Artist;
  winner: boolean | undefined;
}

const BattleArtistCard: React.FC<BattleArtistCardProps> = ({
  artist,
  winner,
}) => {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      prefetch={true}
      aria-label={`გადასვლა ${artist.nickName} გვერდზე`}
    >
      <Avatar>
        <AvatarImage
          src={artist.image || "/assets/artist-placeholder.webp"}
          className="hover:grayscale-0 grayscale transition"
        />
        <AvatarFallback>{artist.nickName[0]}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default BattleArtistCard;
