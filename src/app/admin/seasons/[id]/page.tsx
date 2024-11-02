import { Shell } from "@/components/shell";
import * as React from "react";
import SeasonsForm from "../../_components/seasons/SeasonsForm";
import { getSeasonById } from "@/lib/db/queries";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toUpperCase } from "@/lib/utils";

interface SeasonEditPageProps {
  params: {
    id: string;
  };
}

const SeasonEditPage: React.FC<SeasonEditPageProps> = async ({
  params: { id },
}) => {
  const season = await getSeasonById(id);
  if (!season) {
    return <div>Season not found</div>;
  }
  return (
    <Shell className="mx-auto">
      <Link href="/admin" className="text-white flex items-center gap-2">
        <ArrowLeft className="w-6 h-6" />
        {toUpperCase("უკან დაბრუნება")}
      </Link>
      <SeasonsForm
        initialData={{
          id: season.id,
          name: season.name,
          startDate: season.startDate,
          endDate: season.endDate,
          type: season.type,
          winnerId: season.winnerId,
        }}
      />
    </Shell>
  );
};

export default SeasonEditPage;
