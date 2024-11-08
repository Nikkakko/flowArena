"use client";

import { Artist, ArtistVote, Battle, Season, User } from "@prisma/client";
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
  useReactTable,
} from "@tanstack/react-table";
import { useUser } from "@/lib/auth";
import { toUpperCase } from "@/lib/utils";
import { TrophyIcon } from "lucide-react";

interface LeaderboardTableProps {
  artists: (Artist & {
    votes: ArtistVote[];

    battlesWon: Battle[];
    seasonsWon: Season[];
  })[];
}

export function LeaderboardTable({ artists }: LeaderboardTableProps) {
  const [votingArtist, setVotingArtist] = useState<string | null>(null);
  const { user } = useUser();

  const handleVote = async (artistId: string) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    setVotingArtist(artistId);
    try {
      const response = await fetch("/api/votes/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId }),
      });

      if (!response.ok) throw new Error("Failed to vote");
      toast.success("Vote submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit vote");
    } finally {
      setVotingArtist(null);
    }
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
      header: toUpperCase("მოგება"),
      cell: ({ row }) => {
        return <div className="text-success">{row.original.wins}</div>;
      },
    },
    {
      accessorKey: "loses",
      header: toUpperCase("წაგება"),
      cell: ({ row }) => {
        return <div className="text-destructive">{row.original.loses}</div>;
      },
    },

    {
      accessorKey: "seasonsWon",
      header: toUpperCase("სეზონების მოგება"),
      cell: ({ row }) => {
        const seasons = row.original.seasonsWon.map(season => season.name);
        return (
          <div className="text-success flex items-center gap-1">
            {toUpperCase(seasons.join(", "))}
            {/* if winner show trophy */}
            {row.original.seasonsWon.length > 0 && (
              <TrophyIcon className="w-4 h-4 ml-2" />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="default"
          size="sm"
          className="text-white"
          onClick={() => handleVote(row.original.id)}
          disabled={
            votingArtist === row.original.id ||
            row.original.votes.some(vote => vote.userId === user?.id)
          }
        >
          {row.original.votes.some(vote => vote.userId === user?.id)
            ? "Voted"
            : votingArtist === row.original.id
            ? "Voting..."
            : "Vote"}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: artists,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {toUpperCase("არტისტები არ მოიძებნა")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
