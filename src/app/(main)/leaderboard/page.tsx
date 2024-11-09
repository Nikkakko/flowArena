import { Shell } from "@/components/shell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getLeaderboardArtists } from "@/lib/db/queries";

import { toUpperCase } from "@/lib/utils";
import { SearchParams } from "nuqs";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import SearchField from "@/components/shared/SearchField";

export default async function LeaderBoardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, per_page } = paginationParamsCache.parse(searchParams);
  const queryTransactionsParams =
    typeof searchParams.sArtist === "string" ? searchParams.sArtist : "";

  const data = await getLeaderboardArtists({
    page,
    limit: per_page,

    nickName: queryTransactionsParams,
  });

  if (!data) return null;

  return (
    <main className="container mx-auto py-8 px-4 2xl:px-0">
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

        <section>
          <SearchField
            placeholder={toUpperCase("მოძებნეთ არტისტი")}
            className="w-full max-w-xs lg:max-w-sm"
            query={"sArtist"}
            defaultValue={queryTransactionsParams}
          />

          <LeaderboardTable
            artists={data.artists}
            totalPages={data.totalPages}
            currentPage={page}
          />
        </section>
      </div>
    </main>
  );
}
