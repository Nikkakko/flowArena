import { Shell } from "@/components/shell";
import * as React from "react";
import SeasonsHandle from "../_components/seasons/SeasonsHandle";
import { SearchParams } from "nuqs";
import { getArtists, getSeasons } from "@/lib/db/queries";

interface AdminSeasonsPageProps {
  searchParams: SearchParams;
}

const AdminSeasonsPage: React.FC<AdminSeasonsPageProps> = async ({
  searchParams,
}) => {
  //promise all
  const [artists, seasons] = await Promise.all([getArtists(), getSeasons()]);

  return (
    <Shell className="mx-auto" as="main">
      <SeasonsHandle artists={artists} seasons={seasons} />
    </Shell>
  );
};

export default AdminSeasonsPage;
