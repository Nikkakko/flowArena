import * as z from "zod";
import { BattleType, Season } from "@prisma/client";
// Define the schema based on the Prisma model
export const seasonSchema = z.object({
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  type: z.nativeEnum(BattleType),
  winnerId: z.string().optional().nullable(),
});

export type SeasonFormValues = z.infer<typeof seasonSchema>;
