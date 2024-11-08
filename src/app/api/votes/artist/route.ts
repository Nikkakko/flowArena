import { getUser } from "@/lib/db/queries";
import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { artistId } = await req.json();
    if (!artistId) {
      return new NextResponse("Artist ID is required", { status: 400 });
    }

    const vote = await db.artistVote.create({
      data: {
        userId: user.id,
        artistId,
      },
    });

    return NextResponse.json(vote);
  } catch (error) {
    if ((error as any).code === "P2002") {
      return new NextResponse("You have already voted for this artist", {
        status: 400,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
