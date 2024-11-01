import * as z from "zod";
import { Battle, BattleStatus, BattleType } from "@prisma/client";

const BattleSchema = z.object({
  link: z.string().url(),
  coverImage: z.string().url(),
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.nativeEnum(BattleType),
  status: z.nativeEnum(BattleStatus),
  artists: z.array(z.string()),
  seasonId: z.string().min(3),
  winnerId: z.string(),
});

export type BattleZodType = z.infer<typeof BattleSchema>;
