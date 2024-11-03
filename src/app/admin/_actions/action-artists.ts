"use server";
import db from "@/lib/db/db";
import { artistSchema, ArtistFormValues } from "../lib/artists-validation";
import { slugify } from "@/lib/utils";
import { getUser } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";
//parse  zod schema

export default async function addArtist(values: ArtistFormValues) {
  const parsedValues = artistSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const artistExists = await db.artist.findFirst({
      where: {
        slug: slugify(parsedValues.nickName),
      },
    });

    if (artistExists) {
      return {
        error: "Artist already exists",
      };
    }

    const artist = await db.artist.create({
      data: {
        nickName: parsedValues.nickName,
        image: parsedValues.image,
        slug: slugify(parsedValues.nickName),
        wins: parseInt(parsedValues.wins),
        loses: parseInt(parsedValues.loses),
        bio: parsedValues.bio,
        quotes: { create: parsedValues.quotes.map(quote => ({ quote })) },
        socialMedia: {
          create: parsedValues.socialMedia.map(social => ({
            name: social.name,
            url: social.url,
          })),
        },
        battlesParticipated: {
          connect:
            parsedValues.battlesParticipated?.map(battle => ({
              id: battle.value,
            })) || [],
        },
        seasonsWon: {
          connect:
            parsedValues.seasonsWon?.map(season => ({ id: season.value })) ||
            [],
        },
        battlesWon: {
          connect:
            parsedValues.battlesWon?.map(battle => ({ id: battle.value })) ||
            [],
        },
      },
    });

    //revalidate
    revalidatePath("/admin");

    return artist;
  } catch (error) {
    console.error(error);
  }
}

export async function removeArtist(id: string) {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    await db.artist.delete({
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

export async function updateArtist(id: string, values: ArtistFormValues) {
  const parsedValues = artistSchema.parse(values);
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    // First clear existing relations
    await db.quote.deleteMany({
      where: { artistId: id },
    });

    await db.socialMedia.deleteMany({
      where: { artistId: id },
    });

    // Then update the artist with new data
    const artist = await db.artist.update({
      where: { id },
      data: {
        nickName: parsedValues.nickName,
        image: parsedValues.image,
        slug: slugify(parsedValues.nickName),
        wins: parseInt(parsedValues.wins),
        loses: parseInt(parsedValues.loses),
        bio: parsedValues.bio,
        quotes: {
          create: parsedValues.quotes.map(quote => ({ quote })),
        },
        socialMedia: {
          create: parsedValues.socialMedia.map(social => ({
            name: social.name,
            url: social.url,
          })),
        },
        battlesParticipated: {
          set:
            parsedValues.battlesParticipated?.map(battle => ({
              id: battle.value,
            })) || [],
        },
        seasonsWon: {
          set:
            parsedValues.seasonsWon?.map(season => ({
              id: season.value,
            })) || [],
        },
        battlesWon: {
          set:
            parsedValues.battlesWon?.map(battle => ({
              id: battle.value,
            })) || [],
        },
      },
      include: {
        quotes: true,
        socialMedia: true,
        battlesParticipated: true,
        seasonsWon: true,
        battlesWon: true,
      },
    });

    revalidatePath("/admin");
    return artist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
