import * as React from "react";
import ArtistCard from "@/components/cards/ArtistCard";
import { PaginationProperties } from "@/components/shared/Pagination";
import SearchField from "@/components/shared/SearchField";
import { Shell } from "@/components/shell";
import { paginationParamsCache } from "@/hooks/use-pagination-params";
import { sortingParamsCache } from "@/hooks/use-sorting-params";
import { getFilteredArtists } from "@/lib/db/queries";
import { toUpperCase } from "@/lib/utils";
import { SearchParams } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtistsPageProps {
  searchParams: SearchParams;
}

const ArtistsPage: React.FC<ArtistsPageProps> = async ({ searchParams }) => {
  const { page, per_page } = paginationParamsCache.parse(searchParams);
  const { sort } = sortingParamsCache.parse(searchParams);
  const queryTransactionsParams =
    typeof searchParams.sArtist === "string" ? searchParams.sArtist : "";
  const artistsData = await getFilteredArtists({
    artistName: queryTransactionsParams,
    page,
    limit: per_page,
    sort,
  });

  const totalPages = Math.ceil((artistsData?.total ?? 0) / per_page);
  const checkData =
    artistsData && artistsData.artists && artistsData.artists.length > 0;

  let imageCount = 0;

  return (
    <Shell
      as="section"
      variant="default"
      className="container mx-auto px-4 2xl:px-0 "
    >
      <div className="flex items-start justify-between w-full">
        <SearchField
          placeholder={toUpperCase("მოძებნეთ არტისტი")}
          className="mb-6 max-w-sm"
          query={"sArtist"}
          defaultValue={queryTransactionsParams}
        />
        {/* <BattleSorting /> */}
      </div>

      <React.Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {checkData ? (
            artistsData.artists.map(artist => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                loading={imageCount++ < 6 ? "eager" : "lazy"}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500  h-[calc(100vh-20rem)] flex items-center justify-center">
              {toUpperCase("არტისტები არ მოიძებნა, სცადეთ სხვა სიტყვა")}
            </div>
          )}
        </div>
      </React.Suspense>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <React.Suspense fallback={<Skeleton className="h-10 w-64" />}>
            <PaginationProperties pageCount={totalPages} />
          </React.Suspense>
        </div>
      )}
    </Shell>
  );
};

export default ArtistsPage;
