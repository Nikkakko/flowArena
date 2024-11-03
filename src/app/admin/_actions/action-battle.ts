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
    return {
      error: "Unauthorized",
    };
  }

  try {
    const battleExists = await db.battle.findFirst({
      where: {
        slug: slugify(parsedValues.title),
      },
    });

    if (battleExists) {
      return {
        error: "Battle already exists",
      };
    }

    const battle = await db.battle.create({
      data: {
        title: parsedValues.title,
        slug: slugify(parsedValues.title),
        description: parsedValues.description,
        coverImage: parsedValues.coverImage,
        status: parsedValues.status,
        link: parsedValues.link,
        season: {
          connect: {
            id: parsedValues.seasonId,
          },
        },
        type: parsedValues.type,
        artists: {
          connect: parsedValues.artistIds.map(id => ({ id })),
        },
        winner: {
          connect: {
            id: parsedValues.winnerId,
          },
        },
      },
    });

    //revalidate
    revalidatePath("/admin");

    return battle;
  } catch (error) {
    console.error(error);
  }
}

export async function editBattle(id: string, values: BattleFormValues) {
  const parsedValues = battleSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const battle = await db.battle.update({
      where: {
        id,
      },
      data: {
        title: parsedValues.title,
        slug: slugify(parsedValues.title),
        description: parsedValues.description,
        coverImage: parsedValues.coverImage,
        status: parsedValues.status,
        link: parsedValues.link,
        type: parsedValues.type,
        artists: {
          set: parsedValues.artistIds.map(id => ({ id })),
        },
        winner: {
          connect: {
            id: parsedValues.winnerId,
          },
        },
      },
    });

    //revalidate
    revalidatePath("/admin");

    return battle;
  } catch (error) {
    console.error(error);
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
