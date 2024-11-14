import db from "@/lib/db/db";

interface filteredArtist {
  nickName: string;
  page: number;
  limit: number;
  isFeatured: boolean;
}

interface filteredBattle {
  battleName: string;
  page: number;
  limit: number;
  isFeatured: boolean;
}

export async function getFilteredArtistsAdmin({
  limit,
  page,
  nickName,
  isFeatured,
}: filteredArtist) {
  try {
    const [artists, total] = await Promise.all([
      db.artist.findMany({
        where: {
          nickName: {
            contains: nickName,
            mode: "insensitive",
          },
          ...(isFeatured && { isPopular: true }),
        },
        include: {
          quotes: true,
          socialMedia: true,
          battlesParticipated: true,
          seasonsWon: true,
          battlesWon: true,
        },
        orderBy: {
          wins: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.artist.count({
        where: {
          nickName: {
            contains: nickName,
            mode: "insensitive",
          },
          ...(isFeatured && { isPopular: true }),
        },
      }),
    ]);

    return { artists, total };
  } catch (error) {
    console.error(error);
  }
}

export async function getFilteredBattlesAdmin({
  battleName,
  page,
  limit,
  isFeatured,
}: filteredBattle) {
  try {
    // return db.battle.findMany({
    //   where: {
    //     title: {
    //       contains: battleName,
    //       mode: "insensitive",
    //     },
    //     ...(isFeatured && { isFeatured: true }),
    //   },
    //   include: {
    //     winner: true,
    //     season: true,
    //   },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
    const [battles, total] = await Promise.all([
      db.battle.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          title: {
            contains: battleName,
            mode: "insensitive",
          },
          ...(isFeatured && { isFeatured: true }),

          /* ...(sort && { type: sort === "acapella" ? "ACAPELLA" : "FLOW" }),
          ...(season && {
            season: {
              name: {
                contains: season,
                mode: "insensitive",
              },
            },
          }), */
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          winner: true,
          season: true,
        },
      }),
      db.battle.count({
        where: {
          title: {
            contains: battleName,
            mode: "insensitive",
          },

          ...(isFeatured && { isFeatured: true }),
          /* ...(sort && { type: sort === "acapella" ? "ACAPELLA" : "FLOW" }),
          ...(season && {
            season: {
              name: {
                contains: season,
                mode: "insensitive",
              },
            },
          }), */
        },
      }),
    ]);

    return { battles, total };
  } catch (error) {
    console.error(error);
  }
}
