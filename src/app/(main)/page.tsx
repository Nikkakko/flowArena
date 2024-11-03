import BattlesCard from "@/components/BattlesCard";
import FeaturedArtistsCard from "@/components/FeaturedArtistsCard";
import LatestBattleCard from "@/components/LatestBattleCard";
import { Shell } from "@/components/shell";
import { getFeaturedBattles, getPopularArtists } from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";

export default async function Home() {
  const [battles, popularArtists] = await Promise.all([
    getFeaturedBattles(),
    getPopularArtists(),
  ]);
  return (
    <Shell as="section" className="container mx-auto p-4 2xl:px-0">
      <section className="mb-12  ">
        <h1 className="text-4xl font-bold mb-4 text-white">
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
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {toUpperCase("პოპულარული არტისტები")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularArtists?.map(artist => (
            <FeaturedArtistsCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
      {/* Latest Battles */}
      <section>
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
