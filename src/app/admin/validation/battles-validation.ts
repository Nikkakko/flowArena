import * as z from "zod";
import { Battle, BattleStatus, BattleType } from "@prisma/client";

export const battleSchema = z.object({
  link: z.string().url(),
  coverImage: z.string().url(),
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.nativeEnum(BattleType),
  status: z.nativeEnum(BattleStatus),
  artists: z.array(z.string()),
  season: z.string().min(3),
  winner: z.string(),
});

export type BattleFormValues = z.infer<typeof battleSchema>;
