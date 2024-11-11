import { Shell } from "@/components/shell";
import { getArtistBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import * as React from "react";
import Image from "next/image";
import { Icons } from "@/components/shared/Icons";
import { cn, toUpperCase } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistParticipatedCard from "@/components/cards/ArtistParticipatedCard";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import NoBattlesFoundCard from "@/components/cards/NoBattlesFoundCard";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon } from "lucide-react";
const RandomQuoteList = dynamic(() => import("@/components/RandomQuoteList"), {
  ssr: false,
  loading: () => <Skeleton className="h-12 w-full bg-secondary" />,
});

interface ArtistSlugProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ArtistSlugProps): Promise<Metadata> {
  const artist = await getArtistBySlug(params.slug);

  if (!artist) {
    return {
      title: `${toUpperCase("ბეთლი ვერ მოიძებნა")}`,
      description: `${toUpperCase("ბეთლი ვერ მოიძებნა")}`,
    };
  }

  return {
    title: artist.nickName,
    description: `${toUpperCase("ნახე და შეაფასე ")} ${artist.nickName}`,
  };
}

const ArtistSlug: React.FC<ArtistSlugProps> = async ({ params: { slug } }) => {
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  // Calculate winrate
  const winRate =
    artist.loses > 0
      ? ((artist.wins / (artist.wins + artist.loses)) * 100).toFixed(1)
      : artist.wins > 0
      ? "100"
      : "0";

  const stats = [
    { label: "მოგება", value: artist.wins, valueClass: "text-success" },
    { label: "წაგება", value: artist.loses, valueClass: "text-destructive" },
    {
      label: "ჯამში",
      value: artist.battlesParticipated.length,
      valueClass: "text-white",
    },
    { label: "მოგების %", value: `${winRate} %`, valueClass: "text-primary" },
  ];

  const socialMediaList = artist.socialMedia.map(social => ({
    ...social,
    icon: Icons[social.name.toLowerCase() as keyof typeof Icons],
  }));

  //re-render randomquote every 10 seconds

  return (
    <Shell className="mx-auto flex-1 space-y-8 px-4 2xl:px-0" as="main">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col gap-4 mx-auto">
          <div className="relative w-48 h-48 lg:w-64 lg:h-64">
            <Image
              src={artist.image || "/assets/artist-placeholder.webp"}
              alt={`Artist ${artist.nickName}`}
              fill
              className="rounded-xl object-cover grayscale"
            />
          </div>

          <div className="flex">
            {socialMediaList.map(social => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-primary p-2"
              >
                {social.icon()}
              </a>
            ))}
          </div>

          <RandomQuoteList data={artist.quotes} />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-4xl font-bold text-white mb-4">
                {toUpperCase(artist.nickName)}
              </h1>
              {artist.seasonsWon.length > 0 &&
                artist.seasonsWon.map(season => (
                  <Badge
                    key={season.id}
                    className={cn("bg-primary text-white")}
                  >
                    {toUpperCase(season.name)}
                    <TrophyIcon className="w-4 h-4 ml-1 inline-block" />
                  </Badge>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div
                  key={stat.label}
                  className="bg-secondary/50 p-4 rounded-lg border border-secondary"
                >
                  <p className="text-sm text-gray-400">
                    {toUpperCase(stat.label)}
                  </p>
                  <p className={`text-2xl font-bold ${stat.valueClass}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {artist.battlesParticipated.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                {toUpperCase("ბეთლები")}
              </h2>
              <ScrollArea className="h-[500px]  rounded-md border p-4">
                <div className="grid gap-4">
                  {artist.battlesParticipated?.map(battle => (
                    <ArtistParticipatedCard
                      key={battle.id}
                      battle={battle}
                      artistId={artist.id}
                    />
                  ))}

                  {/* if artists has win but now battle render it */}
                  {artist.wins > artist.battlesWon.length && (
                    <NoBattlesFoundCard />
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default ArtistSlug;
