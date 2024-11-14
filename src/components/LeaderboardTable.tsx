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

interface LeaderboardTableProps {
  artists: (Artist & {
    votes: ArtistVote[];
    battlesWon: Battle[];
    seasonsWon: Season[];
  })[];
  totalPages: number;
}

export function LeaderboardTable({
  artists,
  totalPages,
}: LeaderboardTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { user } = useUser();
  const [isPending, startTransition] = React.useTransition();

  const handleVote = async (artistId: string) => {
    if (!user) {
      toast.error(toUpperCase("გაიარეთ ავტორიზაცია"));
      return;
    }

    startTransition(async () => {
      await addVoteToArtist({ artistId });
    });
  };

  const columns: ColumnDef<(typeof artists)[0]>[] = [
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
          className="flex items-center gap-2"
        >
          {row.original.image && (
            <Image
              src={row.original.image}
              alt={row.original.nickName}
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10"
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
      cell: ({ row }) => (
        <Button
          variant="default"
          size="sm"
          className={cn(
            "text-white",
            checkUserVote(row.original.votes, user?.id)
              ? "bg-destructive"
              : "bg-success"
          )}
          disabled={isPending}
          onClick={() => handleVote(row.original.id)}
        >
          {checkUserVote(row.original.votes, user?.id) ? (
            <ThumbsDownIcon className="w-4 h-4" />
          ) : (
            <ThumbsUpIcon className="w-4 h-4" />
          )}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: artists,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

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
