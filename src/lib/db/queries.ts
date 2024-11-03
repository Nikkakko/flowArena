import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import db from "@/lib/db/db";

export async function getUser() {
  const sessionCookie = cookies().get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "string"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db.user.findMany({
    where: {
      id: sessionData.user.id,
    },
    take: 1,
  });

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getCachedUser() {} // TODO

export async function getArtists() {
  try {
    return db.artist.findMany();
  } catch (error) {
    console.error(error);
  }
}

export async function getArtistBySlug(slug: string) {
  try {
    return db.artist.findFirst({
      where: {
        slug,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getBattles() {
  try {
    return db.battle.findMany({
      include: {
        winner: true,
        season: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getSeasons() {
  try {
    return db.season.findMany({
      include: {
        winner: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getSeasonById(id: string) {
  try {
    return db.season.findFirst({
      where: {
        id,
      },

      include: {
        winner: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getBattleById(id: string) {
  try {
    return db.battle.findFirst({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getArtistById(id: string) {
  try {
    return db.artist.findFirst({
      where: {
        id,
      },
      include: {
        quotes: true,
        socialMedia: true,
        battlesParticipated: true,
        seasonsWon: true,
        battlesWon: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getPopularArtists() {
  try {
    return db.artist.findMany({
      orderBy: {
        wins: "desc",
      },
      where: {
        isPopular: true,
      },
      take: 4,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getFeaturedBattles() {
  try {
    return db.battle.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isFeatured: true,
      },
      take: 6,
    });
  } catch (error) {
    console.error(error);
  }
}
