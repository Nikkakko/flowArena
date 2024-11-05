"use server";
import db from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const voteSchema = z.object({
  battleId: z.string(),
  userId: z.string(),
});

export async function addVoteToBattle(data: z.infer<typeof voteSchema>) {
  const { battleId, userId } = voteSchema.parse(data);
  if (!battleId || !userId) {
    return {
      error: "Invalid data",
    };
  }
  try {
    await db.battleVote.create({
      data: {
        userId,
        battleId,
      },
    });

    //revalidate
    revalidatePath(`/battles`);
  } catch (error) {
    if ((error as any).code === "P2002") {
      // Unique constraint violation on userId and battleId
      console.log("You have already voted for this battle.");
      // Optionally show an error message to the user
      return { error: "You can only vote once per battle." };
    }
    // Handle other errors
    console.error("An unexpected error occurred:", error);
  }
}

export async function removeVoteFromBattle(data: z.infer<typeof voteSchema>) {
  const { battleId, userId } = voteSchema.parse(data);
  if (!battleId || !userId) {
    return {
      error: "Invalid data",
    };
  }
  try {
    await db.battleVote.delete({
      where: {
        userId_battleId: {
          battleId,
          userId,
        },
      },
    });

    //revalidate
    revalidatePath(`/battles`);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}
