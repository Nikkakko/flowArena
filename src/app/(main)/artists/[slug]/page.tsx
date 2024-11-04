import { Shell } from "@/components/shell";
import { getArtistBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import * as React from "react";

interface ArtistSlugProps {
  params: {
    slug: string;
  };
}

const ArtistSlug: React.FC<ArtistSlugProps> = async ({ params: { slug } }) => {
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();
  return (
    <Shell className="mx-auto flex-1" as="main">
      <h1>ArtistSlug</h1>
      <p>{slug}</p>
    </Shell>
  );
};

export default ArtistSlug;
