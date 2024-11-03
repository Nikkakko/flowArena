"use client";
import * as React from "react";
import { Artist, Battle, Season } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import ArtistsForm from "./ArtistsForm";
import { cn, toUpperCase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

interface ArtistsHandleProps {
  artists: Artist[] | undefined;
  battles: Battle[] | undefined;
  seasons: Season[] | undefined;
}

const ArtistsHandle: React.FC<ArtistsHandleProps> = ({
  artists,
  battles,
  seasons,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{toUpperCase("მეტსახელი")}</TableHead>
            <TableHead>{toUpperCase("მოგება")}</TableHead>
            <TableHead>{toUpperCase("წაგება")}</TableHead>
            <TableHead>{toUpperCase("ბიოგრაფია")}</TableHead>
            <TableHead>{toUpperCase("რედაქტირება")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists?.map(artist => (
            <TableRow key={artist.id}>
              <TableCell>{artist.nickName}</TableCell>
              <TableCell>{artist.wins}</TableCell>
              <TableCell>{artist.loses}</TableCell>
              <TableCell>
                {artist.bio ? artist.bio.substring(0, 50) + "..." : ""}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                    href={`/admin/artists/${artist.id}`}
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
                        <AlertDialogCancel>
                          {toUpperCase("გაუქმება")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            startTransition(async () => {
                              await removeArtist(artist.id);
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ArtistsForm artists={artists} battles={battles} seasons={seasons} />
    </>
  );
};

export default ArtistsHandle;
