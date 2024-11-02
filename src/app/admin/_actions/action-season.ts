"use server";
import db from "@/lib/db/db";
import { seasonSchema, SeasonFormValues } from "../lib/seasons-validation";
import { getUser } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export default async function addSeasonAction(values: SeasonFormValues) {
  const parsedValues = seasonSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const seasonExists = await db.season.findFirst({
      where: {
        name: parsedValues.name,
      },
    });

    if (seasonExists) {
      return {
        error: "Season already exists",
      };
    }

    const season = await db.season.create({
      data: {
        name: parsedValues.name,
        startDate: new Date(parsedValues.startDate),
        endDate: new Date(parsedValues.endDate),
        type: parsedValues.type,
        ...(parsedValues.winnerId
          ? {
              winner: {
                connect: {
                  id: parsedValues.winnerId,
                },
              },
            }
          : {}),
        //add winner if winnerId is present
      },
    });

    //revalidate
    revalidatePath("/admin");

    return season;
  } catch (error) {
    console.error(error);
  }
}

export async function editSeason(id: string, values: SeasonFormValues) {
  const parsedValues = seasonSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const season = await db.season.update({
      where: {
        id,
      },
      data: {
        name: parsedValues.name,
        startDate: new Date(parsedValues.startDate),
        endDate: new Date(parsedValues.endDate),
        type: parsedValues.type,
        ...(parsedValues.winnerId
          ? {
              winner: {
                connect: {
                  id: parsedValues.winnerId,
                },
              },
            }
          : {}),
        //add winner if winnerId is present
      },
    });

    //revalidate
    revalidatePath("/admin");

    return season;
  } catch (error) {
    console.error(error);
  }
}

export async function removeSeason(id: string) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    await db.season.delete({
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
