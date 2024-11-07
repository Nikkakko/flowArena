import { getUser } from "@/lib/db/queries";
import db from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateCommentSchema = z.object({
  content: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = updateCommentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { content } = result.data;
    const { commentId } = params;

    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: { content },
      include: { user: true },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
