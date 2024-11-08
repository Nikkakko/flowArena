import { Shell } from "@/components/shell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboardArtists } from "@/lib/db/queries";

import { toUpperCase } from "@/lib/utils";

export default async function LeaderBoardPage() {
  const artists = await getLeaderboardArtists();

  return (
    <Shell as="main" className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {toUpperCase("არტისტების რეიტინგი")}
          </h1>
          <p className="text-muted-foreground">
            {toUpperCase(
              "შეაფასე შენი საყვარელი არტისტები და ნახე როგორ არის მათი რეიტინგი!"
            )}
          </p>
        </div>

        {artists && <LeaderboardTable artists={artists} />}
      </div>
    </Shell>
  );
}
