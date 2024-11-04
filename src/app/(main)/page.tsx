import BattlesCard from "@/components/BattlesCard";
import FeaturedArtistsCard from "@/components/FeaturedArtistsCard";
import LatestBattleCard from "@/components/LatestBattleCard";
import { Shell } from "@/components/shell";
import { getFeaturedBattles, getPopularArtists } from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default async function Home() {
  const [battles, popularArtists] = await Promise.all([
    getFeaturedBattles(),
    getPopularArtists(),
  ]);
  return (
    <Shell as="section" className="container mx-auto ">
      <section className="mb-12 p-4 2xl:px-0 ">
        <h1 className="lg:text-4xl text-base font-bold mb-4 text-white">
          {toUpperCase("მოგესალმებით FlowFlow Magazine-ში")}
        </h1>
        <p className="text-gray-400 text-xl mb-6">
          {toUpperCase("აღმოაჩინეთ საუკეთესო რეპ ბეთლები და არტისტები")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {battles?.map(battle => (
            <BattlesCard key={battle.id} battle={battle} />
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="mb-12 w-full max-w-[375px] md:max-w-[512px] lg:max-w-[768px] xl:max-w-[1184px] 2xl:max-w-full">
        <h2 className="lg:text-2xl text-lg font-bold mb-6 text-white px-4 2xl:px-0">
          {toUpperCase("პოპულარული არტისტები")}
        </h2>

        <Carousel>
          <CarouselPrevious className="text-white border-primary " />
          <CarouselContent>
            {popularArtists?.map(artist => (
              <CarouselItem
                key={artist.id}
                className="basis-[290px] md:basis-1/2 lg:basis-1/3 pl-8"
              >
                <FeaturedArtistsCard artist={artist} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="text-white border-primary" />
        </Carousel>
      </section>
      {/* Latest Battles */}
      <section className="p-4 2xl:px-0">
        <h2 className="text-2xl font-bold mb-6">
          {toUpperCase("უახლესი ბეთლები")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <LatestBattleCard key={i} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
