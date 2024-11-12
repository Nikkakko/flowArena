import { Artist, Battle, Season } from "@prisma/client";
import { toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { removeBattle } from "../../_actions/action-battle";

export const createBattleColumns = (
  router: AppRouterInstance,
  startTransition: React.TransitionStartFunction,
  isPending: boolean
) => [
  {
    accessorKey: "title",
    header: toUpperCase("სათაური"),
  },
  {
    accessorKey: "type",
    header: toUpperCase("ტიპი"),
  },
  {
    accessorKey: "winner",
    header: toUpperCase("გამარჯვებული"),
    cell: ({
      row,
    }: {
      row: {
        original: Battle & { winner: Artist | null; season: Season | null };
      };
    }) => row.original.winner?.nickName ?? "",
  },
  {
    accessorKey: "status",
    header: toUpperCase("სტატუსი"),
  },
  {
    accessorKey: "season",
    header: toUpperCase("სეზონი"),
    cell: ({
      row,
    }: {
      row: {
        original: Battle & { winner: Artist | null; season: Season | null };
      };
    }) => toUpperCase(row.original.season?.name ?? ""),
  },
  {
    id: "actions",
    cell: ({
      row,
    }: {
      row: {
        original: Battle & { winner: Artist | null; season: Season | null };
      };
    }) => (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(`/admin/battles/${row.original.id}`);
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
              <AlertDialogCancel>{toUpperCase("გაუქმება")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  startTransition(async () => {
                    await removeBattle(row.original.id);
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
