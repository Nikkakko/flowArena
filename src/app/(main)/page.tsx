import BattlesCard from "@/components/BattlesCard";
import FeaturedArtistsCard from "@/components/FeaturedArtistsCard";
import LatestBattleCard from "@/components/LatestBattleCard";
import { Shell } from "@/components/shell";
import { toUpperCase } from "@/lib/utils";

export default function Home() {
  return (
    <Shell as="section" className="container mx-auto">
      <section className="mb-12 p-4 lg:p-0">
        <h1 className="text-4xl font-bold mb-4 text-white">
          {toUpperCase("მოგესალმებით FlowFlow Magazine-ში")}
        </h1>
        <p className="text-gray-400 text-xl mb-6">
          {toUpperCase("აღმოაჩინეთ საუკეთესო რეპ ბეთლები და არტისტები")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <BattlesCard key={i} />
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {toUpperCase("პოპულარული არტისტები")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <FeaturedArtistsCard key={i} />
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
