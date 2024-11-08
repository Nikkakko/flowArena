import { toUpperCase } from "@/lib/utils";
import { Artist, Quote, SocialMedia } from "@prisma/client";
import Image from "next/image";
import * as React from "react";
import { Icons } from "../shared/Icons";
import Link from "next/link";

interface FeaturedArtistsCardProps {
  artist: Artist & {
    quotes: Quote[];
    socialMedia: SocialMedia[];
  };
}

const FeaturedArtistsCard: React.FC<FeaturedArtistsCardProps> = ({
  artist,
}) => {
  const socialMediaList = artist.socialMedia.map(social => ({
    ...social,
    icon: Icons[social.name.toLowerCase() as keyof typeof Icons],
  }));

  return (
    <div className="bg-secondary rounded-lg p-2 lg:p-4 text-center shadow-sm border lg:hover:border-primary transition relative ">
      <div className="flex items-start lg:items-center gap-4">
        <div className="min-w-24 h-24 relative">
          <Image
            src={artist.image || "/assets/artist-placeholder.webp"}
            alt={`Artist ${artist.nickName}`}
            fill
            className="rounded-full object-cover grayscale select-none"
          />
        </div>

        <div className="flex flex-col gap-1 select-none text-start">
          <h3 className="font-semibold text-white">
            {toUpperCase(artist.nickName)}
          </h3>
          {artist.wins > 0 && (
            <p className="text-sm text-gray-400">
              {toUpperCase("მოგება")}:{" "}
              <span className="text-success">{artist.wins} </span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 absolute z-20 bottom-2  right-2 lg:right-4">
        {socialMediaList.map(social => {
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-primary"
            >
              {social.icon()}
            </a>
          );
        })}
      </div>

      <Link href={`/artists/${artist.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">{toUpperCase(artist.nickName)}</span>
      </Link>
    </div>
  );
};

export default FeaturedArtistsCard;
