import * as React from "react";
import { Shell } from "@/components/shell";
import { getBattleBySlug } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { toUpperCase } from "@/lib/utils";
import { BattleInteractions } from "@/components/BattleInteractions";
import { BattleCommentsSection } from "@/components/BattleCommentsSection";

interface BattleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BattleDetailPageProps): Promise<Metadata> {
  const battle = await getBattleBySlug(params.slug);

  if (!battle) {
    return {
      title: `${toUpperCase("ბეთლი ვერ მოიძებნა")}`,
      description: `${toUpperCase("ბეთლი ვერ მოიძებნა")}`,
    };
  }

  return {
    title: battle.title,

    description: `${toUpperCase("ნახე და შეაფასე ")} ${battle.title}`,
  };
}

const BattleDetailPage: React.FC<BattleDetailPageProps> = async ({
  params: { slug },
}) => {
  const battle = await getBattleBySlug(slug);
  if (!battle) notFound();

  return (
    <Shell variant="default" className="mx-auto ">
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-secondary border-none mb-6">
            <CardHeader>
              <CardTitle className="text-white">{battle.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${battle.link}`}
                  title={battle.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture,x-frame-options"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
              <BattleInteractions
                votesCount={battle.votes.length}
                commentsCount={battle.comments.length}
                battleId={battle.id}
                votes={battle.votes}
              />
            </CardContent>
          </Card>

          <Card className="bg-secondary border-none mb-6">
            <CardHeader>
              <CardTitle className="text-white">
                {toUpperCase("კომენტარები")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BattleCommentsSection
                comments={battle.comments}
                battleId={battle.id}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </Shell>
  );
};

export default BattleDetailPage;
