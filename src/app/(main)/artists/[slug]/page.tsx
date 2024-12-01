import { Shell } from "@/components/shell";
import { getArtistBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import * as React from "react";
import Image from "next/image";
import { Icons } from "@/components/shared/Icons";
import { calculateWinRate, cn, toUpperCase } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import ArtistParticipatedCard from "@/components/cards/ArtistParticipatedCard";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import NoBattlesFoundCard from "@/components/cards/NoBattlesFoundCard";
import { Badge } from "@/components/ui/badge";
import { TrophyIcon } from "lucide-react";
import ArtistStatsCard from "@/components/cards/ArtistStatsCard";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
const RandomQuoteList = dynamic(() => import("@/components/RandomQuoteList"), {
  ssr: false,
  loading: () => <Skeleton className="h-12 w-full bg-secondary" />,
});

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      title: `${toUpperCase("არტისტი ვერ მოიძებნა")}`,
      description: `${toUpperCase("არტისტი ვერ მოიძებნა")}`,
    };
  }

  return {
    title: `Flow Arena - ${artist.nickName}`,
    description: `${toUpperCase("ნახე და შეაფასე ")} ${artist.nickName}`,
  };
}

const ArtistSlug: React.FC<ArtistSlugProps> = async ({ params: { slug } }) => {
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const winRate = calculateWinRate(artist);

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

  return (
    <Shell className="mx-auto flex-1 space-y-8 px-4 2xl:px-0 gap-0" as="main">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{toUpperCase("მთავარი")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/artists">
              {toUpperCase("არტისტები")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{artist.nickName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col gap-4 ">
          <div className="relative w-48 h-48 lg:w-64 lg:h-64">
            <Image
              src={artist.image || "/assets/artist-placeholder.webp"}
              alt={`Artist ${artist.nickName}`}
              fill
              sizes="(min-width: 1040px) 256px, 192px"
              className="rounded-xl object-cover grayscale"
            />
          </div>

          <div className="flex space-x-2">
            {socialMediaList.map(social => (
              <Link
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "icon",
                  }),
                  "text-white hover:text-primary  "
                )}
              >
                {social.icon()}
              </Link>
            ))}
          </div>

          <RandomQuoteList data={artist.quotes} />
        </div>

        <div className="flex-1 space-y-6 w-full">
          <>
            <div className="flex items-start lg:items-center justify-between w-full gap-2">
              <h1 className="text-xl lg:text-4xl font-bold text-white ">
                {toUpperCase(artist.nickName)}
              </h1>
              <div className="flex flex-col lg:flex-row items-end lg:items-center gap-2">
                {artist.seasonsWon.length > 0 &&
                  artist.seasonsWon.map(season => (
                    <Badge
                      key={season.id}
                      className={cn("bg-primary text-white whitespace-nowrap")}
                    >
                      {toUpperCase(season.name)}
                      <TrophyIcon className="w-4 h-4 ml-1 inline-block" />
                    </Badge>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <ArtistStatsCard key={stat.label} stat={stat} />
              ))}
            </div>
          </>

          {artist.battlesParticipated.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-semibold text-white">
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
