import SearchField from "@/components/shared/SearchField";
import { Shell } from "@/components/shell";
import * as React from "react";
import BattlesHandle from "../_components/battles/BattlesHandle";
import { getSeasons, getUser } from "@/lib/db/queries";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import {
  getFilteredArtistsAdmin,
  getFilteredBattlesAdmin,
} from "../lib/queries";
import { redirect } from "next/navigation";
import { toUpperCase } from "@/lib/utils";

interface BattlesAdminPageProps {
  searchParams: SearchParams;
}

const BattlesAdminPage: React.FC<BattlesAdminPageProps> = async ({
  searchParams,
}) => {
  const user = await getUser();
  const { page, per_page } = paginationParamsCache.parse(searchParams);

  const queryTransactionsParamsArtist =
    typeof searchParams.sArtist === "string" ? searchParams.sArtist : "";

  const queryTransactionsParamsBattle =
    typeof searchParams.sBattle === "string" ? searchParams.sBattle : "";

  //promise all
  const [artists, battles, seasons] = await Promise.all([
    getFilteredArtistsAdmin({
      limit: per_page,
      page,
      nickName: queryTransactionsParamsArtist,
    }),
    getFilteredBattlesAdmin({
      battleName: queryTransactionsParamsBattle,
      page,
      limit: per_page,
    }),
    getSeasons(),
  ]);

  if (user && user.role !== "ADMIN") {
    redirect("/sign-in");
  }

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
