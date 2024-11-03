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
import { Artist, Battle, Season } from "@prisma/client";
import { Button } from "@/components/ui/button";
import BattlesForm from "./BattlesForm";
import { toUpperCase } from "@/lib/utils";
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
import { removeBattle } from "../../_actions/action-battle";

interface BattlesHandleProps {
  battles:
    | (Battle & { winner: Artist | null; season: Season | null })[]
    | undefined;
  artists: Artist[] | undefined;
  seasons: Season[] | undefined;
}

const BattlesHandle: React.FC<BattlesHandleProps> = ({
  battles,
  artists,
  seasons,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{toUpperCase("სათაური")}</TableHead>
            <TableHead>{toUpperCase("ტიპი")}</TableHead>
            <TableHead>{toUpperCase("გამარჯვებული")}</TableHead>
            <TableHead>{toUpperCase("სტატუსი")}</TableHead>
            <TableHead>{toUpperCase("სეზონი")}</TableHead>
            <TableHead>{toUpperCase("რედაქტირება")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battles?.map(battle => (
            <TableRow key={battle.id}>
              <TableCell>{battle.title}</TableCell>
              <TableCell>{battle.type}</TableCell>
              <TableCell>{battle.winner?.nickName}</TableCell>
              <TableCell>{battle.status}</TableCell>
              <TableCell>{toUpperCase(battle.season?.name || "")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/admin/battles/${battle.id}`);
                    }}
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
                              await removeBattle(battle.id);
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

      <BattlesForm artists={artists} seasons={seasons} />
    </>
  );
};

export default BattlesHandle;
