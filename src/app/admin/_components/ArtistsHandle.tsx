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

interface ArtistsHandleProps {
  artists: Artist[] | undefined;
}

const ArtistsHandle: React.FC<ArtistsHandleProps> = ({ artists }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Wins</TableHead>
            <TableHead>Losses</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Actions</TableHead>
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
