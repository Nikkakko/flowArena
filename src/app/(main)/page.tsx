import BattlesCard from "@/components/cards/BattlesCard";
import FeaturedArtistsCard from "@/components/cards/FeaturedArtistsCard";
import LatestBattleCard from "@/components/cards/LatestBattleCard";
import { Shell } from "@/components/shell";
import {
  getFeaturedBattles,
  getLattestBattles,
  getPopularArtists,
} from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArtistTooltip from "@/components/artist-tooltip";
import { siteConfig } from "@/config/site";

export default async function Home() {
  const [battles, popularArtists, latestBattles] = await Promise.all([
    getFeaturedBattles(),
    getPopularArtists(),
    getLattestBattles(),
  ]);

  let imageCount = 0;

  return (
    <Shell as="section" className="mx-auto container">
      <section className="mb-12 p-4 2xl:px-0 ">
        <h1 className="lg:text-4xl text-base font-bold mb-4 text-white">
          {toUpperCase(siteConfig.welcomeMessage)}
        </h1>
        <p className="text-gray-400 text-base lg:text-xl mb-6">
          {toUpperCase(siteConfig.description)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container gap-4">
          {battles?.map((battle, i) => (
            <BattlesCard
              key={battle.id}
              battle={battle}
              className="col-span-1 md:col-span-2 lg:col-span-1 "
              loading={imageCount++ < 8 ? "eager" : "lazy"}
            />
          ))}
        </div>

        <Link
          href="/battles"
          prefetch={true}
          className="text-white font-normal flex items-center justify-end gap-2 mt-4
           group hover:text-primary transition-colors duration-300 ease-in-out 
            "
        >
          {toUpperCase("ყველა ბეთლი")}
          <ArrowRight
            className="inline-block 
            group-hover:translate-x-2 transition-transform duration-300 ease-in-out
          "
          />
        </Link>
      </section>

      {/* Featured Artists */}
      <section className="mb-12 w-full max-w-[375px] sm:container">
        <h2 className="lg:text-2xl text-lg font-bold mb-6 text-white px-4 2xl:px-0">
          {toUpperCase("პოპულარული არტისტები")}
        </h2>

        <Carousel>
          <CarouselPrevious className="text-white border-primary -translate-y-[-80px] left-4" />
          <CarouselContent>
            {popularArtists?.map(artist => (
              <CarouselItem
                key={artist.id}
                className="basis-[300px] md:basis-1/2 lg:basis-1/3  "
              >
                <ArtistTooltip data={artist.quotes}>
                  <FeaturedArtistsCard artist={artist} />
                </ArtistTooltip>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="text-white border-primary  -translate-y-[-80px] right-4" />
        </Carousel>
      </section>
      {/* Latest Battles */}
      <section className="p-4 2xl:px-0">
        <h2 className="lg:text-2xl text-lg font-bold mb-6 text-white px-4 2xl:px-0">
          {toUpperCase("უახლესი ბეთლები")}
        </h2>
        <div className="space-y-4">
          {latestBattles?.map(battle => (
            <LatestBattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
