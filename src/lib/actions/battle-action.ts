"use server";
import * as z from "zod";
import db from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";

const voteSchema = z.object({
  battleId: z.string(),
  userId: z.string(),
  hasVoted: z.boolean(),
});

// export async function addVoteToBattle(data: z.infer<typeof voteSchema>) {
//   const { battleId, userId } = voteSchema.parse(data);
//   if (!battleId || !userId) {
//     return {
//       error: "Invalid data",
//     };
//   }
//   try {
//     await db.battleVote.create({
//       data: {
//         userId,
//         battleId,
//       },
//     });

//     //revalidate
//     revalidatePath(`/battles`);
//   } catch (error) {
//     if ((error as any).code === "P2002") {
//       // Unique constraint violation on userId and battleId
//       console.log("You have already voted for this battle.");
//       // Optionally show an error message to the user
//       return { error: "You can only vote once per battle." };
//     }
//     // Handle other errors
//     console.error("An unexpected error occurred:", error);
//   }
// }

export const addVoteToBattle = actionClient
  .schema(voteSchema)
  .action(async ({ parsedInput }) => {
    const { battleId, userId, hasVoted } = parsedInput;
    if (!battleId || !userId) {
      return {
        error: "Invalid data",
      };
    }
    try {
      if (hasVoted) {
        await db.battleVote.delete({
          where: {
            userId_battleId: {
              userId: userId,
              battleId: battleId,
            },
          },
        });
      } else {
        await db.battleVote.create({
          data: {
            userId,
            battleId,
          },
        });
      }

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
  });

// export async function removeVoteFromBattle(data: z.infer<typeof voteSchema>) {
//   const { battleId, userId } = voteSchema.parse(data);
//   if (!battleId || !userId) {
//     return {
//       error: "Invalid data",
//     };
//   }
//   try {
//     await db.battleVote.delete({
//       where: {
//         userId_battleId: {
//           battleId,
//           userId,
//         },
//       },
//     });

//     //revalidate
//     revalidatePath(`/battles`);
//   } catch (error) {
//     console.error("An unexpected error occurred:", error);
//   }
// }

export const removeVoteFromBattle = actionClient
  .schema(voteSchema)
  .action(async ({ parsedInput }) => {
    const { battleId, userId } = parsedInput;
    if (!battleId || !userId) {
      return {
        error: "Invalid data",
      };
    }
    try {
      await db.battleVote.delete({
        where: {
          userId_battleId: {
            userId: userId,
            battleId: battleId,
          },
        },
      });

      //revalidate
      revalidatePath(`/battles`);

      // Optionally return data to the client
      return {
        hasVoted: false,
      };
    } catch (error) {
      if ((error as any).code === "P2025") {
        // Unique constraint violation on userId and battleId
        console.log("Record to delete does not exist.");
        // Optionally show an error message to the user
        return { error: "You can only vote once per battle." };
      }
      console.error("An unexpected error occurred:", error);
    }
  });

export const toggleBattleVote = actionClient
  .schema(voteSchema)
  .action(async ({ parsedInput }) => {
    const { battleId, userId, hasVoted } = parsedInput;
    if (!battleId || !userId) {
      return {
        error: "Invalid data",
      };
    }
    try {
      if (hasVoted) {
        await db.battleVote.delete({
          where: {
            userId_battleId: {
              userId: userId,
              battleId: battleId,
            },
          },
        });
      } else {
        await db.battleVote.create({
          data: {
            userId,
            battleId,
          },
        });
      }

      //revalidate
      revalidatePath(`/battles`);

      // Optionally return data to the client
      return {
        hasVoted: !hasVoted,
      };
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  });
