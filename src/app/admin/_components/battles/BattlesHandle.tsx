"use client";
import * as React from "react";
import { Artist, Battle, Season } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "../shared/DataTable";
import { removeBattle } from "../../_actions/action-battle";
import BattlesForm from "./BattlesForm";
import { createBattleColumns } from "./columns";

interface BattlesHandleProps {
  battles:
    | (Battle & { winner: Artist | null; season: Season | null })[]
    | undefined;
  artists: Artist[] | undefined;
  seasons: Season[] | undefined;
  totalPage: number;
}

const BattlesHandle: React.FC<BattlesHandleProps> = ({
  battles,
  artists,
  seasons,
  totalPage,
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const columns = createBattleColumns(router, startTransition, isPending);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={battles ?? []} pageCount={totalPage} />
      <BattlesForm artists={artists} seasons={seasons} />
    </div>
  );
};

export default BattlesHandle;
