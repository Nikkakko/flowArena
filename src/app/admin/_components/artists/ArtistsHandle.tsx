"use client";
import * as React from "react";
import { Artist, Battle, Season, Quote, SocialMedia } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, toUpperCase } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DataTable } from "../shared/DataTable";

import ArtistsForm from "./ArtistsForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeArtist } from "../../_actions/action-artists";

interface ExtendedArtist extends Artist {
  quotes: Quote[];
  socialMedia: SocialMedia[];
  battlesParticipated: Battle[];
  seasonsWon: Season[];
  battlesWon: Battle[];
}

interface ArtistsHandleProps {
  artists: ExtendedArtist[] | undefined;
  battles: Battle[] | undefined;
  seasons: Season[] | undefined;
}

const ArtistsHandle: React.FC<ArtistsHandleProps> = ({
  artists,
  battles,
  seasons,
}) => {
  const [isPending, startTransition] = React.useTransition();

  const columns = [
    {
      accessorKey: "nickName",
      header: toUpperCase("მეტსახელი"),
    },
    {
      accessorKey: "wins",
      header: toUpperCase("მოგება"),
    },
    {
      accessorKey: "loses",
      header: toUpperCase("წაგება"),
    },
    //season won
    {
      accessorKey: "seasons",
      header: toUpperCase("სეზონები"),
      cell: ({ row }: { row: { original: ExtendedArtist } }) =>
        row.original.seasonsWon?.map(season => season.name).join(", "),
    },

    {
      accessorKey: "bio",
      header: toUpperCase("ბიოგრაფია"),
      cell: ({ row }: { row: { original: Artist } }) =>
        row.original.bio?.substring(0, 50) + "...",
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Artist } }) => (
        <div className="flex items-center gap-4">
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            href={`/admin/artists/${row.original.id}`}
          >
            {toUpperCase("რედაქტირება")}
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                {toUpperCase("წაშლა")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {toUpperCase("ნამდვილად წაშლეთ სეზონი?")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {toUpperCase(
                    "წაშლის შემდეგ ამ არტისტის ბრძოლები და ბრძოლები წაიშლება"
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{toUpperCase("გაუქმება")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    startTransition(async () => {
                      await removeArtist(row.original.id);
                    })
                  }
                  disabled={isPending}
                >
                  {toUpperCase("წაშლა")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={artists ?? []}
        pageCount={Math.ceil((artists?.length ?? 0) / 10)}
      />
      <ArtistsForm artists={artists} battles={battles} seasons={seasons} />
    </div>
  );
};

export default ArtistsHandle;
