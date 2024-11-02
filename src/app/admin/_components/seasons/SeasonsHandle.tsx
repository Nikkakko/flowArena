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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import SeasonsForm from "./SeasonsForm";
import { toUpperCase } from "@/lib/utils";
import { removeSeason } from "../../_actions/action-season";
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
import { useRouter } from "next/navigation";

interface SeasonsHandleProps {
  seasons: Season[] | undefined;
  artists: Artist[] | undefined;
}

const SeasonsHandle: React.FC<SeasonsHandleProps> = ({
  seasons,

  artists,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

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
          {seasons?.map(season => (
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
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/seasons/${season.id}`)}
                  >
                    {toUpperCase("რედაქტირება")}
                  </Button>
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
                            "წაშლის შემდეგ ამ სეზონის მონაწილეები და ბრძოლები წაიშლება"
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
                              await removeSeason(season.id);
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

      <SeasonsForm artists={artists} />
    </>
  );
};

export default SeasonsHandle;
