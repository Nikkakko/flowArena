import * as React from "react";
import { Shell } from "@/components/shell";
import { getUser, getSeasons } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import ArtistsHandle from "./_components/artists/ArtistsHandle";
import {
  getFilteredArtistsAdmin,
  getFilteredBattlesAdmin,
} from "./lib/queries";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { SearchParams } from "nuqs";
import SearchField from "@/components/shared/SearchField";
import { cn, toUpperCase } from "@/lib/utils";
import Link from "next/link";
import { AdminNavigation } from "./_components/AdminNavigation";

const navigationItems = [
  { name: "არტისტები", href: "/admin" },
  { name: "ბეთლები", href: "/admin/battles" },
  { name: "სეზონები", href: "/admin/seasons" },
];

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
        placeholder={toUpperCase("მოძებნეთ არტისტი")}
        className="mb-6 max-w-sm"
        query={"sArtist"}
        defaultValue={queryTransactionsParamsArtist}
      />

      <ArtistsHandle artists={artists} battles={battles} seasons={seasons} />
    </Shell>
  );
};

export default AdminPage;
