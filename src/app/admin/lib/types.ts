import { BattleStatus, BattleType } from "@prisma/client";

export type selectBattleType = {
  value: BattleType;
  label: string;
};

export type selectBattleStatus = {
  value: BattleStatus;
  label: string;
};
