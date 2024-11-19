import db from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const battleId = searchParams.get("battleId");
  if (!battleId) {
    return NextResponse.json(
      { error: "Battle ID is required" },
      { status: 400 }
    );
  }
  try {
    const comments = await db.comment.findMany({
      where: {
        battleId,
      },
      include: {
        user: true,
        commentLikes: true,
      },
      orderBy: [
        {
          commentLikes: {
            _count: "desc",
          },
        },
        {
          createdAt: "asc",
        },
      ],
    });

    //revalidate
    revalidatePath("/battles");

    return NextResponse.json(comments);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
