import { BattleStatus, BattleType } from "@prisma/client";
import { selectBattleStatus, selectBattleType } from "./types";

export const selectTypeList: selectBattleType[] = [
  {
    value: BattleType.ACAPELLA,
    label: "აკაპელა",
  },
  {
    value: BattleType.FLOW,
    label: "ფლოუ",
  },
];

export const selectBattleStatusList: selectBattleStatus[] = [
  {
    value: BattleStatus.UPCOMING,
    label: "მოახლოებული",
  },
  {
    value: BattleStatus.LIVE,
    label: "მიმდინარე",
  },
  {
    value: BattleStatus.COMPLETED,
    label: "დასრულებული",
  },
];
