import * as React from "react";
import { Season } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import SeasonsForm from "./SeasonsForm";

interface SeasonsHandleProps {
  seasons: Season[] | undefined;
}

const SeasonsHandle: React.FC<SeasonsHandleProps> = ({ seasons: data }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Winner ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(season => (
            <TableRow key={season.id}>
              <TableCell>{season.name}</TableCell>
              <TableCell>{season.type}</TableCell>
              <TableCell>
                {format(new Date(season.startDate), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>
                {format(new Date(season.endDate), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>{season.winnerId}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={() => handleEdit(season)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SeasonsForm />
    </>
  );
};

export default SeasonsHandle;
