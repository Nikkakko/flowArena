"use server";
import * as z from "zod";
import { actionClient } from "../safe-action";
import db from "@/lib/db/db";
import { getUser } from "../db/queries"; // Changed import
import { toUpperCase } from "../utils";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/session";
import { NextResponse } from "next/server";

const voteSchema = z.object({
  artistId: z.string(),
});

export const addVoteToArtist = actionClient
  .schema(voteSchema)
  .action(async ({ parsedInput }) => {
    const { artistId } = parsedInput;
    const session = await getSession();
    if (!session?.user) {
      return {
        error: "Unauthorized",
        status: 401,
      };
    }

    if (!artistId) {
      return { error: toUpperCase("არასწორი მონაცემები") };
    }

    try {
      // Check if vote exists first
      const existingVote = await db.artistVote.findUnique({
        where: {
          userId_artistId: {
            userId: session.user.id,
            artistId: artistId,
          },
        },
      });

      if (existingVote) {
        // Delete vote
        await db.artistVote.delete({
          where: {
            userId_artistId: {
              userId: session.user.id,
              artistId: artistId,
            },
          },
        });
      } else {
        // Create new vote
        await db.artistVote.create({
          data: {
            userId: session.user.id,
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
