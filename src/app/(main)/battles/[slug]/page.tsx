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
import { battleTypes } from "@/config/constants";

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
    title: `Flow Arena - ${battle.title}`,
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

  const battleType =
    battleTypes.find(type => type.value === battle.type)?.label || "სხვა";

  return (
    <Shell variant="default" className="mx-auto gap-0 ">
      <Breadcrumb className="mb-6 px-2 lg:px-6 2xl:px-0">
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

      <main className="p-2 lg:p-6">
        <div className="max-w-4xl mx-auto ">
          <Card className="bg-secondary border-none mb-6">
            <CardHeader className="p-3 lg:p-6">
              <div className="flex flex-col lg:flex-row items-start justify-between w-full">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-white">{battle.title}</CardTitle>
                  <p className="text-gray-400">{toUpperCase(battleType)}</p>
                </div>
                <CardTitle className="text-white text-base">
                  {toUpperCase(battle.season?.name || "სეზონი არ მოიძებნა")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-6">
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
                  className="absolute top-0 left-0 w-full  h-full rounded-lg"
                />
              </div>
              <p className="text-sm lg:text-base text-gray-400 mb-4">
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
            <CardHeader className="p-3 lg:p-6">
              <CardTitle className="text-white">
                {toUpperCase("კომენტარები")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 lg:p-6">
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
