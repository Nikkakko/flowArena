"use server";
import db from "@/lib/db/db";
import { slugify } from "@/lib/utils";
import { getUser } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";
import { BattleFormValues, battleSchema } from "../lib/battles-validation";
//parse  zod schema

export async function addBattleAction(values: BattleFormValues) {
  const parsedValues = battleSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    // Check if battle exists
    const battleExists = await db.battle.findFirst({
      where: { slug: slugify(parsedValues.title) },
    });

    if (battleExists) {
      return { error: "Battle already exists" };
    }

    // Only validate winner if it exists
    if (
      parsedValues.winnerId &&
      !parsedValues.artistIds.includes(parsedValues.winnerId)
    ) {
      return { error: "Winner must be one of the battle participants" };
    }

    // Verify all artists exist
    const existingArtists = await db.artist.findMany({
      where: { id: { in: parsedValues.artistIds } },
      select: { id: true },
    });

    if (existingArtists.length !== parsedValues.artistIds.length) {
      return { error: "One or more artists do not exist" };
    }

    const result = await db.$transaction(async tx => {
      // Create battle with optional winner
      const battle = await tx.battle.create({
        data: {
          title: parsedValues.title,
          slug: slugify(parsedValues.title),
          description: parsedValues.description,
          coverImage: parsedValues.coverImage,
          isFeatured: parsedValues.isFeatured,
          status: parsedValues.status,
          link: parsedValues.link,
          season: { connect: { id: parsedValues.seasonId } },
          type: parsedValues.type,
          artists: { connect: parsedValues.artistIds.map(id => ({ id })) },
          // Only connect winner if it exists
          ...(parsedValues.winnerId && {
            winner: { connect: { id: parsedValues.winnerId } },
          }),
        },
      });

      // Only update statistics if there's a winner
      if (parsedValues.winnerId) {
        // Update winner
        await tx.artist.update({
          where: { id: parsedValues.winnerId },
          data: { wins: { increment: 1 } },
        });

        // Update losers
        const loserIds = parsedValues.artistIds.filter(
          id => id !== parsedValues.winnerId
        );

        await tx.artist.updateMany({
          where: { id: { in: loserIds } },
          data: { loses: { increment: 1 } },
        });
      }

      return battle;
    });

    revalidatePath("/admin");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create battle:", error);
    return { error: "Failed to create battle" };
  }
}

export async function updateBattle(id: string, values: BattleFormValues) {
  const parsedValues = battleSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const existingBattle = await db.battle.findUnique({
      where: { id },
      select: { winnerId: true, artists: { select: { id: true } } },
    });

    if (!existingBattle) {
      return { error: "Battle not found" };
    }

    const result = await db.$transaction(async tx => {
      const battle = await tx.battle.update({
        where: { id },
        data: {
          title: parsedValues.title,
          slug: slugify(parsedValues.title),
          description: parsedValues.description,
          coverImage: parsedValues.coverImage,
          status: parsedValues.status,
          link: parsedValues.link,
          type: parsedValues.type,
          isFeatured: parsedValues.isFeatured,
          artists: { set: parsedValues.artistIds.map(id => ({ id })) },
          winner: parsedValues.winnerId
            ? { connect: { id: parsedValues.winnerId } }
            : { disconnect: true },
        },
      });

      if (existingBattle.winnerId !== parsedValues.winnerId) {
        if (existingBattle.winnerId) {
          await tx.artist.update({
            where: { id: existingBattle.winnerId },
            data: { wins: { decrement: 1 } },
          });
        }

        if (parsedValues.winnerId) {
          await tx.artist.update({
            where: { id: parsedValues.winnerId },
            data: { wins: { increment: 1 } },
          });
        }

        const previousLoserIds = existingBattle.artists
          .map(artist => artist.id)
          .filter(id => id !== existingBattle.winnerId);

        const newLoserIds = parsedValues.artistIds.filter(
          id => id !== parsedValues.winnerId
        );

        await tx.artist.updateMany({
          where: { id: { in: previousLoserIds } },
          data: { loses: { decrement: 1 } },
        });

        await tx.artist.updateMany({
          where: { id: { in: newLoserIds } },
          data: { loses: { increment: 1 } },
        });
      }

      return battle;
    });

    revalidatePath("/admin");

    return result;
  } catch (error) {
    console.error(error);
    return { error: "Failed to update battle" };
  }
}

export async function removeBattle(id: string) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    await db.battle.delete({
      where: {
        id,
      },
    });

    //revalidate
    revalidatePath("/admin");
  } catch (error) {
    console.error(error);
  }
}
