"use server";
import * as z from "zod";
import { actionClient } from "../safe-action";
import db from "@/lib/db/db";
import { getUser } from "../db/queries";
import { toUpperCase } from "../utils";
import { revalidatePath } from "next/cache";

const voteSchema = z.object({
  artistId: z.string(),
});

export const addVoteToArtist = actionClient
  .schema(voteSchema)
  .action(async ({ parsedInput }) => {
    const { artistId } = parsedInput;
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return { error: toUpperCase("გაიარეთ ავტორიზაცია") };
    }

    if (!artistId) {
      return { error: toUpperCase("არასწორი მონაცემები") };
    }

    try {
      // Check if vote exists first
      const existingVote = await db.artistVote.findUnique({
        where: {
          userId_artistId: {
            userId: userId,
            artistId: artistId,
          },
        },
      });

      if (existingVote) {
        // Delete vote
        await db.artistVote.delete({
          where: {
            userId_artistId: {
              userId: userId,
              artistId: artistId,
            },
          },
        });
      } else {
        // Create new vote
        await db.artistVote.create({
          data: {
            userId,
            artistId,
          },
        });
      }

      revalidatePath(`/leaderboard`);
      return { success: true };
    } catch (error) {
      return { error: toUpperCase("დაფიქსირდა შეცდომა") };
    }
  });
