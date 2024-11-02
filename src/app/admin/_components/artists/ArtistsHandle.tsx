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
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                  href={`/admin/artists/${artist.id}`}
                >
                  Edit
                </Link>
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
