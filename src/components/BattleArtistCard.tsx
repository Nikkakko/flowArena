import { Artist } from "@prisma/client";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface BattleArtistCardProps {
  artist: Artist;
}

const BattleArtistCard: React.FC<BattleArtistCardProps> = ({ artist }) => {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      prefetch={true}
      aria-label={`გადასვლა ${artist.nickName} გვერდზე`}
      className="border border-primary rounded-full  hover:grayscale transition"
    >
      <Avatar>
        <AvatarImage src={artist.image || "/assets/artist-placeholder.webp"} />
        <AvatarFallback>{artist.nickName[0]}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default BattleArtistCard;
