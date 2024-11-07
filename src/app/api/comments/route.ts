import db from "@/lib/db/db";
import { getUser } from "@/lib/db/queries";
import rateLimit from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const battleId = searchParams.get("battleId");

    if (!battleId) {
      return NextResponse.json(
        { error: "Battle ID is required" },
        { status: 400 }
      );
    }

    const comments = await db.comment.findMany({
      where: {
        battleId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //revalidate
    revalidatePath("/battles");

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
