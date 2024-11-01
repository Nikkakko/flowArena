import * as React from "react";
import { Artist } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ArtistsForm from "./ArtistsForm";
import { toUpperCase } from "@/lib/utils";

interface ArtistsHandleProps {
  artists: Artist[] | undefined;
}

const ArtistsHandle: React.FC<ArtistsHandleProps> = ({ artists }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{toUpperCase("სახელი")}</TableHead>
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
              <TableCell>{`${artist.firstName} ${artist.lastName}`}</TableCell>
              <TableCell>{artist.nickName}</TableCell>
              <TableCell>{artist.wins}</TableCell>
              <TableCell>{artist.loses}</TableCell>
              <TableCell>
                {artist.bio ? artist.bio.substring(0, 50) + "..." : ""}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  //   onClick={() => handleEdit(artist)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ArtistsForm />
    </>
  );
};

export default ArtistsHandle;
