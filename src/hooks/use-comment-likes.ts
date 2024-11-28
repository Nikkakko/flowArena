import { addLikeToComment } from "@/lib/actions/battle-action";
import { fetcher } from "@/lib/swr";
import { Comment, CommentLike, User } from "@prisma/client";
import { useCallback } from "react";
import { toast } from "sonner";
import useSWR from "swr";

interface CommentWithUser extends Comment {
  user: User;
  commentLikes: CommentLike[];
}

interface useCommentLikesProps {
  battleId: string;
  userId: string | undefined;
  fallbackData?: CommentWithUser[];
}

export function useCommentLikes({
  battleId,
  userId,
  fallbackData,
}: useCommentLikesProps) {
  const { data: comments, mutate } = useSWR(
    `/api/comments?battleId=${battleId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      fallbackData: fallbackData || [],
    }
  );

  const toggleLike = useCallback(
    async (commentId: string) => {
      if (!userId || !comments) {
        return toast.error("გაიარეთ ავტორიზაცია");
      }

      const originalComments = comments;
      const commentIndex = comments.findIndex(
        (c: CommentWithUser) => c.id === commentId
      );
      if (commentIndex === -1) return;

      const isLiked = comments[commentIndex].commentLikes.some(
        (like: CommentLike) => like.userId === userId
      );

      const updatedComments = comments.map((comment: CommentWithUser) =>
        comment.id === commentId
          ? {
              ...comment,
              commentLikes: isLiked
                ? comment.commentLikes.filter(like => like.userId !== userId)
                : [
                    ...comment.commentLikes,
                    { id: "temp-id", userId, createdAt: new Date(), commentId },
                  ],
            }
          : comment
      );

      try {
        mutate(updatedComments, false);

        const result = await addLikeToComment({ commentId });

        if (result?.data?.error) {
          throw new Error(result.data.error);
        }

        mutate(
          (currentComments: CommentWithUser[]) =>
            currentComments?.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    commentLikes: isLiked
                      ? comment.commentLikes.filter(
                          like => like.userId !== userId
                        )
                      : [
                          ...comment.commentLikes.filter(
                            like => like.userId !== userId
                          ),
                          {
                            id:
                              result?.data?.likesCount?.toString() ||
                              "default-id",
                            userId,
                            createdAt: new Date(),
                            commentId,
                          },
                        ],
                  }
                : comment
            ),
          false
        );
      } catch (error) {
        console.error("Failed to toggle like:", error);
        mutate(originalComments, false);
      }
    },
    [comments, mutate, userId]
  );

  return { comments, toggleLike, mutate };
}
