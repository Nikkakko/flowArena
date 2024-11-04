import { toUpperCase } from "@/lib/utils";
import { Artist, Quote, SocialMedia } from "@prisma/client";
import { YoutubeIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Icons } from "./Icons";

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
    <div className="bg-secondary rounded-lg p-2 lg:p-4 text-center shadow-sm border lg:hover:border-primary transition ">
      <div className="flex items-center gap-4">
        <div className="min-w-24 h-24 relative">
          <Image
            src={artist.image || "/images/artist-placeholder.png"}
            alt={`Artist ${artist.nickName}`}
            fill
            className="rounded-full object-cover grayscale select-none"
          />
        </div>
        <div className="w-full flex justify-between ">
          <div className="flex flex-col gap-1 select-none text-start">
            <h3 className="font-semibold text-white">
              {toUpperCase(artist.nickName)}
            </h3>
            <p className="text-sm text-gray-400">
              {toUpperCase("მოგება")}:{" "}
              <span className="text-success">{artist.wins} </span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtistsCard;
