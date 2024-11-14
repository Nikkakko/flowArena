import * as React from "react";
import { Shell } from "@/components/shell";
import { getUser, getSeasons, getBattles } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import ArtistsHandle from "./_components/artists/ArtistsHandle";
import {
  getFilteredArtistsAdmin,
  getFilteredBattlesAdmin,
} from "./lib/queries";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import SearchField from "@/components/shared/SearchField";
import { toUpperCase } from "@/lib/utils";
import { featuredParamsCache } from "@/hooks/use-featured-params";

interface AdminPageProps {
  searchParams: SearchParams;
}

const AdminPage: React.FC<AdminPageProps> = async ({ searchParams }) => {
  const user = await getUser();
  const { page, per_page } = paginationParamsCache.parse(searchParams);
  const queryTransactionsParamsArtist =
    typeof searchParams.sArtist === "string" ? searchParams.sArtist : "";
  const queryTransactionsParamsBattle =
    typeof searchParams.sBattle === "string" ? searchParams.sBattle : "";
  const { isFeatured } = featuredParamsCache.parse(searchParams);

  //promise all
  const [artists, battles, seasons] = await Promise.all([
    getFilteredArtistsAdmin({
      limit: per_page,
      page,
      nickName: queryTransactionsParamsArtist,
      isFeatured,
    }),
    getBattles(),
    getSeasons(),
  ]);

  const totalPages = Math.ceil((artists?.total ?? 0) / per_page);

  return (
    <Shell className="mx-auto" variant="default">
      <SearchField
        placeholder={toUpperCase("მოძებნეთ არტისტი")}
        className="mb-6 max-w-sm"
        query={"sArtist"}
        defaultValue={queryTransactionsParamsArtist}
      />

      <ArtistsHandle
        artists={artists?.artists ?? []}
        battles={battles}
        seasons={seasons}
        totalPage={totalPages}
      />
    </Shell>
  );
};

export default AdminPage;
