import * as React from "react";
import { Shell } from "@/components/shell";
import { getBattleBySlug } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getYouTubeVideoId, toUpperCase } from "@/lib/utils";
import { BattleInteractions } from "@/components/battle/BattleInteractions";
import { BattleCommentsSection } from "@/components/battle/BattleCommentsSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const battleDescription = battle.description
    ? battle.description.slice(0, 100)
    : "";

  return (
    <Shell variant="default" className="mx-auto gap-0 ">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{toUpperCase("მთავარი")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/battles">
              {toUpperCase("ბეთლები")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{battle.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className="p-6 ">
        <div className="max-w-4xl mx-auto ">
          <Card className="bg-secondary border-none mb-6">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-white">{battle.title}</CardTitle>
                <CardTitle className="text-white text-base">
                  {toUpperCase(battle.season?.name || "სეზონი არ მოიძებნა")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    battle.link
                  )}`}
                  title={battle.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
              <p className="text-gray-400 mb-4">
                {toUpperCase(battleDescription)}
              </p>

              <BattleInteractions
                votesCount={battle.votes.length}
                commentsCount={battle.comments.length}
                battleId={battle.id}
                votes={battle.votes}
                artists={battle.artists}
                winnerId={battle.winnerId}
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
