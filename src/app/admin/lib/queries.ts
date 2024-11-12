import db from "@/lib/db/db";

interface filteredArtist {
  nickName: string;
  page: number;
  limit: number;
}

interface filteredBattle {
  battleName: string;
  page: number;
  limit: number;
}

export async function getFilteredArtistsAdmin({ limit, page, nickName }: filteredArtist) {
  try {
    return db.artist.findMany({
      where: {
        nickName: {
          contains: nickName,
          mode: "insensitive",
        },
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
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getFilteredBattlesAdmin({ battleName, page, limit }: filteredBattle) {
  try {
    return db.battle.findMany({
      where: {
        title: {
          contains: battleName,
          mode: "insensitive",
        },
      },
      include: {
        winner: true,
        season: true,
      },

      skip: (page - 1) * limit,
      take: limit,
    });
  } catch (error) {
    console.error(error);
  }
}
