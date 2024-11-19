import db from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const artistName = searchParams.get("artistName") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(
      1,
      Math.min(50, Number(searchParams.get("limit")) || 12)
    );

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid page or limit parameters" },
        { status: 400 }
      );
    }

    const [artists, total] = await db.$transaction([
      db.artist.findMany({
        orderBy: [{ wins: "desc" }, { votes: { _count: "desc" } }],
        where: artistName
          ? {
              nickName: {
                contains: artistName,
                mode: "insensitive",
              },
            }
          : undefined,
        include: {
          votes: true,
          battlesWon: true,
          seasonsWon: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.artist.count({
        where: artistName
          ? {
              nickName: {
                contains: artistName,
                mode: "insensitive",
              },
            }
          : undefined,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      artists,
      totalPages,
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Artists API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
