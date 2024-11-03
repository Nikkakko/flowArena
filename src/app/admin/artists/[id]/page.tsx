import { Shell } from "@/components/shell";
import { getArtistById, getBattles, getSeasons } from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import ArtistsForm from "../../_components/artists/ArtistsForm";

interface ArtistEditPageProps {
  params: {
    id: string;
  };
}

const ArtistEditPage: React.FC<ArtistEditPageProps> = async ({
  params: { id },
}) => {
  const [artist, battles, seasons] = await Promise.all([
    getArtistById(id),
    getBattles(),
    getSeasons(),
  ]);

  if (!artist) {
    return <div>Artist not found</div>;
  }
  return (
    <Shell className="mx-auto">
      <Link href="/admin" className="text-white flex items-center gap-2">
        <ArrowLeft className="w-6 h-6" />
        {toUpperCase("უკან დაბრუნება")}
      </Link>
      <ArtistsForm
        initialData={{
          id: artist.id,
          nickName: artist.nickName,
          image: artist.image,
          wins: artist.wins.toString(),
          loses: artist.loses.toString(),
          bio: artist.bio,
          quotes: artist.quotes.map(quote => quote.quote),
          socialMedia: artist.socialMedia.map(social => ({
            name: social.name,
            url: social.url,
          })),
          battlesParticipated: artist.battlesParticipated.map(battle => ({
            label: battle.title,
            value: battle.id,
          })),
          seasonsWon: artist.seasonsWon.map(season => ({
            label: season.name,
            value: season.id,
          })),

          battlesWon: artist.battlesWon.map(battle => ({
            label: battle.title,
            value: battle.id,
          })),
        }}
        battles={battles}
        seasons={seasons}
      />
    </Shell>
  );
};

export default ArtistEditPage;
