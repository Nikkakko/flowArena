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

export async function getArtistBySlug(slug: string) {
  try {
    return db.artist.findFirst({
      where: {
        slug,
      },
      include: {
        quotes: true,
        socialMedia: true,
        battlesParticipated: {
          include: {
            season: true,
          },
          orderBy: [
            {
              createdAt: "asc",
            },
          ],
        },
        seasonsWon: true,
        battlesWon: true,
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
      include: {
        winner: true,
        season: true,
        artists: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        votes: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getBattleBySlug(slug: string) {
  try {
    const battle = await db.battle.findFirst({
      where: {
        slug,
      },
      include: {
        winner: true,
        season: true,
        artists: true,

        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        votes: true,
      },
    });

    return battle;
  } catch (error) {
    console.error(error);
  }
}

export async function getArtists() {
  try {
    return db.artist.findMany({
      orderBy: {
        wins: "desc",
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
        wins: {
          gt: 0,
        },
      },
      include: {
        quotes: true,
        socialMedia: true,
      },
      take: 10,
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

export async function getFilteredBattles({
  battleName,
  page,
  limit,
  sort,
  season,
}: {
  battleName: string;
  page: number;
  limit: number;
  sort: string | null;
  season: string | undefined;
}) {
  try {
    const battles = await db.battle.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        title: {
          contains: battleName,
          mode: "insensitive",
        },
        ...(sort && { type: sort === "acapella" ? "ACAPELLA" : "FLOW" }),
        ...(season && {
          season: {
            name: {
              contains: season,
              mode: "insensitive",
            },
          },
        }),
      },

      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.battle.count({
      where: {
        title: {
          contains: battleName,
          mode: "insensitive",
        },

        ...(sort && { type: sort === "acapella" ? "ACAPELLA" : "FLOW" }),
        ...(season && {
          season: {
            name: {
              contains: season,
              mode: "insensitive",
            },
          },
        }),
      },
    });

    return { battles, total };
  } catch (error) {
    console.error(error);
  }
}
export async function getSeasons() {
  try {
    return db.season.findMany({
      include: {
        winner: true,
        battles: true,
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

export async function getFilteredArtists({
  artistName,
  page,
  limit,
  sort,
}: {
  artistName: string;
  page: number;
  limit: number;
  sort: string | null;
}) {
  try {
    const artists = await db.artist.findMany({
      orderBy: [
        {
          wins: "desc",
        },
      ],
      where: {
        nickName: {
          contains: artistName,
          mode: "insensitive",
        },
        ...(sort && { type: sort === "acapella" ? "ACAPELLA" : "FLOW" }),
      },
      include: {
        seasonsWon: true,
        socialMedia: true,
        quotes: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.artist.count({
      where: {
        nickName: {
          contains: artistName,
          mode: "insensitive",
        },
      },
    });

    return { artists, total };
  } catch (error) {
    console.error(error);
  }
}

export async function getLeaderboardArtists({
  page,
  limit,
  nickName,
}: {
  page: number;
  limit: number;
  nickName?: string;
}) {
  try {
    const artists = await db.artist.findMany({
      orderBy: [
        {
          wins: "desc",
        },
        {
          votes: {
            _count: "desc",
          },
        },
      ],
      where: {
        nickName: {
          contains: nickName,
          mode: "insensitive",
        },
      },

      include: {
        votes: true,
        battlesWon: true,
        seasonsWon: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.artist.count();

    return {
      artists,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getLattestBattles() {
  try {
    return db.battle.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      include: {
        artists: true,
        winner: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
