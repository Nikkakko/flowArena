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
import { Skeleton } from "@/components/ui/skeleton";

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

  let imageCount = 0;

  return (
    <Shell
      as="section"
      variant="default"
      className="container mx-auto px-4 2xl:px-0"
    >
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between w-full">
        <SearchField
          placeholder={toUpperCase("მოძებნეთ ბეთლები")}
          className="w-full sm:max-w-sm mb-2 sm:mb-6"
          query={"sBattle"}
          defaultValue={queryTransactionsParams}
        />
        <React.Suspense fallback={<Skeleton className="h-10 w-64" />}>
          <div className="flex flex-col lg:flex-row gap-2 items-start sm:items-center">
            <SelectSeason seasons={seasons} />
            <BattleSorting />
          </div>
        </React.Suspense>
      </div>

      <React.Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[316px] lg:h-[400px]" />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-3 md:grid-cols-2 xl:grid-cols-3">
          {checkData ? (
            battleData.battles.map(battle => (
              <BattlesCard
                key={battle.id}
                battle={battle}
                loading={imageCount++ < 6 ? "eager" : "lazy"}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500  h-[calc(100vh-20rem)] flex items-center justify-center">
              {toUpperCase("ბეთლი არ მოიძებნა, სცადეთ სხვა სიტყვა")}
            </div>
          )}
        </div>
      </React.Suspense>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <React.Suspense fallback={<Skeleton className="h-10 w-64" />}>
            <PaginationProperties pageCount={totalPages} />
          </React.Suspense>
        </div>
      )}
    </Shell>
  );
};

export default BattlesPage;
