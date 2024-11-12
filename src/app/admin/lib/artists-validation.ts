import * as z from "zod";
import { SocialMediaPlatforms, Battle, Season } from "@prisma/client";

export const artistSchema = z.object({
  nickName: z.string().min(2).max(50),
  image: z.string().url().optional().nullable(),
  wins: z.string().min(0), // TODO: Change to number
  loses: z.string().min(0), // TODO: Change to number
  bio: z.string().max(500),
  quotes: z.array(z.string().max(400)),
  isPopular: z.boolean(),
  socialMedia: z.array(
    z.object({
      name: z.nativeEnum(SocialMediaPlatforms),
      url: z.string().url(),
    })
  ),
  battlesParticipated: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),

  seasonsWon: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),

  battlesWon: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),

  // battlesParticipated: z.array(z.string()).optional(),
  // seasonsWon: z.array(z.string()).optional(),
  // battlesWon: z.array(z.string()).optional(),
});

//export type
export type ArtistFormValues = z.infer<typeof artistSchema>;
