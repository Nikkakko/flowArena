import SearchField from "@/components/shared/SearchField";
import { Shell } from "@/components/shell";
import * as React from "react";
import BattlesHandle from "../_components/battles/BattlesHandle";
import { getArtists, getSeasons } from "@/lib/db/queries";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import {
  getFilteredArtistsAdmin,
  getFilteredBattlesAdmin,
} from "../lib/queries";
import { toUpperCase } from "@/lib/utils";

interface BattlesAdminPageProps {
  searchParams: SearchParams;
}

const BattlesAdminPage: React.FC<BattlesAdminPageProps> = async ({
  searchParams,
}) => {
  const { page, per_page } = paginationParamsCache.parse(searchParams);

  const queryTransactionsParamsArtist =
    typeof searchParams.sArtist === "string" ? searchParams.sArtist : "";

  const queryTransactionsParamsBattle =
    typeof searchParams.sBattle === "string" ? searchParams.sBattle : "";

  //promise all
  const [artists, battles, seasons] = await Promise.all([
    getArtists(),
    getFilteredBattlesAdmin({
      battleName: queryTransactionsParamsBattle,
      page,
      limit: per_page,
    }),
    getSeasons(),
  ]);

  return (
    <Shell className="mx-auto" variant="default">
      <SearchField
        placeholder={toUpperCase("მოძებნეთ ბეთლები")}
        className="mb-6 max-w-sm"
        query={"sBattle"}
        defaultValue={queryTransactionsParamsBattle}
      />

      {/* <ArtistsHandle artists={artists} battles={battles} seasons={seasons} /> */}
      <BattlesHandle artists={artists} battles={battles} seasons={seasons} />
    </Shell>
  );
};

export default BattlesAdminPage;
