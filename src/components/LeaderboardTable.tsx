"use client";
import * as React from "react";
import { Artist, ArtistVote, Battle, Season } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useUser } from "@/lib/auth";
import { checkUserVote, cn, toUpperCase } from "@/lib/utils";
import {
  TrophyIcon,
  ChevronDown,
  ChevronUp,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import { PaginationProperties } from "./shared/Pagination";
import { addVoteToArtist } from "@/lib/actions/artist-action";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardTableProps {
  artists: (Artist & {
    votes: ArtistVote[];
    battlesWon: Battle[];
    seasonsWon: Season[];
  })[];
  totalPages: number;
}

export function LeaderboardTable({
  artists: fallbackArtists,
  totalPages,
}: LeaderboardTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { user } = useUser();
  // const [isPending, startTransition] = React.useTransition();
  const params = useSearchParams();

  const {
    data: artists = { artists: fallbackArtists, totalPages },
    mutate,
    isLoading,
  } = useSWR<LeaderboardTableProps>(
    "/api/artists",
    async () => {
      const response = await fetch(`/api/artists`);
      return response.json();
    },
    {
      revalidateIfStale: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      dedupingInterval: 7200000, // 2 hours in milliseconds
      fallbackData: { artists: fallbackArtists, totalPages },
    }
  );

  const handleVote = async (artistId: string) => {
    if (!user) {
      toast.error(toUpperCase("გაიარეთ ავტორიზაცია"));
      return;
    }

    const optimisticData = artists.artists.map(artist => {
      if (artist.id === artistId) {
        const hasVoted = checkUserVote(artist.votes, user.id);
        return {
          ...artist,
          votes: hasVoted
            ? artist.votes.filter(vote => vote.userId !== user.id)
            : [
                ...artist.votes,
                {
                  id: "temp-id",
                  userId: user.id,
                  artistId,
                  createdAt: new Date(),
                },
              ],
          battlesWon: artist.battlesWon,
          seasonsWon: artist.seasonsWon,
        };
      }
      return artist;
    });

    mutate({ artists: optimisticData, totalPages }, false);

    try {
      const response = await addVoteToArtist({ artistId });

      if (response?.data?.error) {
        // Check for error property
        throw new Error(response.data.error);
      }

      // Only mutate if successful
      await mutate(); // Revalidate to get fresh data
    } catch (error) {
      // Revert optimistic update
      await mutate(); // Revalidate to restore correct state
      toast.error(toUpperCase("ვოტის დამატება ვერ ხერხდება"));
    }
  };

  const columns: ColumnDef<LeaderboardTableProps["artists"][0]>[] = [
    {
      accessorKey: "rank",
      header: toUpperCase("რეიტინგი"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "artist",
      header: toUpperCase("არტისტი"),
      cell: ({ row }) => (
        <Link
          href={`/artists/${row.original.slug}`}
          className="flex items-center gap-2 "
        >
          {row.original.image && (
            <Image
              src={row.original.image}
              alt={row.original.nickName}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10 grayscale group-hover:grayscale-0 transition-all"
              quality={100}
            />
          )}
          <span>{row.original.nickName}</span>
        </Link>
      ),
    },
    {
      accessorKey: "wins",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            {toUpperCase("მოგება")}
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-success text-center lg:text-start">
            {row.original.wins}
          </div>
        );
      },
    },
    {
      accessorKey: "loses",
      header: toUpperCase("წაგება"),
      cell: ({ row }) => {
        return (
          <div className="text-destructive text-center lg:text-start">
            {row.original.loses}
          </div>
        );
      },
    },
    {
      accessorKey: "votes",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1"
          >
            {toUpperCase("ხმები")}
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => row.original.votes.length,
    },

    {
      accessorKey: "seasonsWon",
      header: toUpperCase("სეზონების მოგება"),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col-reverse lg:flex-row text-center items-center gap-1">
            {row.original.seasonsWon.map((season: Season, index: number) => (
              <TrophyIcon key={index} className="w-4 h-4 shrink-0 t" />
            ))}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: toUpperCase("შეფასება"),
      cell: ({ row }) => {
        const hasVoted = checkUserVote(row.original.votes, user?.id);
        return (
          <Button
            variant="default"
            size="sm"
            className={cn(
              "text-white relative w-14 h-12",
              hasVoted
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-success hover:bg-success/90"
            )}
            onClick={() => handleVote(row.original.id)}
          >
            <AnimatePresence initial={false} mode="wait">
              {hasVoted ? (
                <motion.div
                  key={"thumbsDown" + row.original.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ThumbsDownIcon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key={"thumbsUp" + row.original.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ThumbsUpIcon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: artists?.artists ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border my-10 w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {toUpperCase("იტვირთება...")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border my-10 w-full overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {toUpperCase("არტისტები არ მოიძებნა")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && <PaginationProperties pageCount={totalPages} />}
    </>
  );
}
