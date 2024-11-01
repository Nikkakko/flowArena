"use server";
import db from "@/lib/db/db";
import {
  artistSchema,
  ArtistFormValues,
} from "../validation/artists-validation";
import { slugify } from "@/lib/utils";
//parse  zod schema

export default async function addArtist(values: ArtistFormValues) {
  const parsedValues = artistSchema.parse(values);

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
        firstName: parsedValues.firstName,
        lastName: parsedValues.lastName,
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
          connect: parsedValues.battlesParticipated?.map(id => ({ id })) || [],
        },
        seasonsWon: {
          connect: parsedValues.seasonsWon?.map(id => ({ id })) || [],
        },
        battlesWon: {
          connect: parsedValues.battlesWon?.map(id => ({ id })) || [],
        },
      },
    });

    return artist;
  } catch (error) {
    console.error(error);
  }
}
