"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Battle } from "@prisma/client";
import { Button } from "@/components/ui/button";
import BattlesForm from "./BattlesForm";

interface BattlesHandleProps {
  battles: Battle[] | undefined;
}

const BattlesHandle: React.FC<BattlesHandleProps> = ({ battles: data }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(battle => (
            <TableRow key={battle.id}>
              <TableCell>{battle.title}</TableCell>
              <TableCell>{battle.type}</TableCell>
              <TableCell>{battle.status}</TableCell>
              <TableCell>{battle.description?.substring(0, 50)}...</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={() => handleEdit(battle)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BattlesForm />
    </>
  );
};

export default BattlesHandle;
