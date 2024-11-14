import { BattleType } from "@prisma/client";

interface ExtendedBattleType {
  value: BattleType;
  label: string;
}

export const battleTypes: ExtendedBattleType[] = [
  { value: BattleType.ACAPELLA, label: "აკაპელა" },
  { value: BattleType.FLOW, label: "ფლოუ" },
];
