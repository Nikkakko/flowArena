import SearchField from "@/components/shared/SearchField";
import { Shell } from "@/components/shell";
import * as React from "react";
import BattlesHandle from "../_components/battles/BattlesHandle";
import { getArtists, getBattles, getSeasons } from "@/lib/db/queries";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import { getFilteredBattlesAdmin } from "../lib/queries";
import { toUpperCase } from "@/lib/utils";
import { featuredParamsCache } from "@/hooks/use-featured-params";
import { notFound } from "next/navigation";

interface BattlesAdminPageProps {
  searchParams: SearchParams;
}

const BattlesAdminPage: React.FC<BattlesAdminPageProps> = async ({
  searchParams,
}) => {
  const { page, per_page } = paginationParamsCache.parse(searchParams);
  const { isFeatured } = featuredParamsCache.parse(searchParams);

  const queryTransactionsParamsBattle =
    typeof searchParams.sBattle === "string" ? searchParams.sBattle : "";

  //promise all
  const [artists, battles, seasons] = await Promise.all([
    getArtists(),
    getFilteredBattlesAdmin({
      battleName: queryTransactionsParamsBattle,
      page,
      limit: per_page,
      isFeatured,
    }),

    getSeasons(),
  ]);

  const totalPages = Math.ceil((battles?.total ?? 0) / per_page);

  return (
    <Shell className="mx-auto" variant="default">
      <SearchField
        placeholder={toUpperCase("მოძებნეთ ბეთლები")}
        className="mb-6 max-w-sm"
        query={"sBattle"}
        defaultValue={queryTransactionsParamsBattle}
      />

      <BattlesHandle
        artists={artists}
        battles={battles?.battles ?? []}
        totalPage={totalPages}
        seasons={seasons}
      />
    </Shell>
  );
};

export default BattlesAdminPage;
