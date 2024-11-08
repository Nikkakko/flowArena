import * as React from "react";
import { Shell } from "@/components/shell";
import { getFilteredBattles, getSeasons } from "@/lib/db/queries";
import BattleSorting from "@/components/battle/BattleSorting";
import { toUpperCase } from "@/lib/utils";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import { PaginationProperties } from "@/components/shared/Pagination";
import BattlesCard from "@/components/cards/BattlesCard";
import { sortingParamsCache } from "@/hooks/use-sorting-params";
import SearchField from "@/components/shared/SearchField";
import SelectSeason from "@/components/SelectSeason";
import { seasonParamsCache } from "@/hooks/use-season-params";

interface BattlesPageProps {
  searchParams: SearchParams;
}

const BattlesPage: React.FC<BattlesPageProps> = async ({ searchParams }) => {
  const { page, per_page } = paginationParamsCache.parse(searchParams);
  const { season } = seasonParamsCache.parse(searchParams);
  const { sort } = sortingParamsCache.parse(searchParams);
  const queryTransactionsParams =
    typeof searchParams.sBattle === "string" ? searchParams.sBattle : "";

  const [battleData, seasons] = await Promise.all([
    getFilteredBattles({
      battleName: queryTransactionsParams,
      page,
      limit: per_page,
      sort,
      season,
    }),
    getSeasons(),
  ]);

  const totalPages = Math.ceil((battleData?.total ?? 0) / per_page);
  const checkData =
    battleData && battleData.battles && battleData.battles.length > 0;

  return (
    <Shell as="section" variant="default" className="container mx-auto">
      <div className="flex items-start justify-between w-full">
        <SearchField
          placeholder={toUpperCase("მოძებნეთ ბეთლები")}
          className="mb-6 max-w-sm"
          query={"sBattle"}
          defaultValue={queryTransactionsParams}
        />
        <div className="flex items-center space-x-2">
          <SelectSeason seasons={seasons} />
          <BattleSorting />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {checkData ? (
          battleData.battles.map(battle => (
            <BattlesCard key={battle.id} battle={battle} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500  h-[calc(100vh-20rem)] flex items-center justify-center">
            {toUpperCase("ბეთლი არ მოიძებნა, სცადეთ სხვა სიტყვა")}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <React.Suspense>
            <PaginationProperties pageCount={totalPages} />
          </React.Suspense>
        </div>
      )}
    </Shell>
  );
};

export default BattlesPage;
