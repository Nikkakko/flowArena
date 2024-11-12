import { Shell } from "@/components/shell";
import { getArtists, getBattleById, getSeasons } from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import BattlesForm from "../../_components/battles/BattlesForm";

interface BattleEditPageProps {
  params: {
    id: string;
  };
}

const BattleEditPage: React.FC<BattleEditPageProps> = async ({
  params: { id },
}) => {
  const [battle, artists, seasons] = await Promise.all([
    getBattleById(id),
    getArtists(),
    getSeasons(),
  ]);

  if (!battle) {
    return <div>Battle not found</div>;
  }

  return (
    <Shell className="mx-auto">
      <Link
        href="/admin/battles"
        className="text-white flex items-center gap-2"
      >
        <ArrowLeft className="w-6 h-6" />
        {toUpperCase("უკან დაბრუნება")}
      </Link>
      <BattlesForm
        initialData={{
          id: battle.id,
          title: battle.title,
          description: battle.description || "",
          link: battle.link,
          coverImage: battle.coverImage,
          type: battle.type,
          status: battle.status,
          artistIds: battle.artists.map(artist => artist.id),
          seasonId: battle.season?.id || "",
          winnerId: battle?.winner?.id,
          isFeatured: battle.isFeatured,

          // Add other relevant battle fields here
        }}
        artists={artists}
        seasons={seasons}
      />
    </Shell>
  );
};

export default BattleEditPage;
