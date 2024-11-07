import { Comment, User } from "@prisma/client";
import {
  addCommentToBattle as addComment,
  deleteComment as deleteBattleComment,
  editComment as editBattleComment,
} from "../actions/battle-action";

export const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CommentWithUser extends Comment {
  user: User;
}

export const addCommentToBattle = async (
  battleId: string,
  content: string
): Promise<CommentWithUser> => {
  // const response = await fetch("/api/comments", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ battleId, content }),
  // });

  const response = await addComment({ battleId, content });

  if (!response?.data?.success) {
    throw new Error("Failed to add comment");
  }

  return response.data.newComment;
};

export const addCommentOptions = (newComment: CommentWithUser) => ({
  optimisticData: (comments: CommentWithUser[] = []) => [
    newComment,
    ...comments,
  ],
  rollbackOnError: true,
  populateCache: (added: CommentWithUser, comments: CommentWithUser[] = []) => [
    added,
    ...comments,
  ],
  revalidate: false,
});

export const deleteComment = async (commentId: string) => {
  // const response = await fetch(`/api/comments`, {
  //   method: "DELETE",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ commentId }),
  // });

  const response = await deleteBattleComment({ commentId });

  if (!response?.data?.success) {
    throw new Error("Failed to delete comment");
  }

  return response.data.commentId;
};

export const deleteCommentOptions = (commentId: string) => ({
  optimisticData: (comments: CommentWithUser[] = []) =>
    comments.filter(comment => comment.id !== commentId),
  rollbackOnError: true,
  populateCache: (data: any, comments: CommentWithUser[] = []) =>
    comments.filter(comment => comment.id !== commentId),
  revalidate: false,
});

export const editComment = async (commentId: string, content: string) => {
  // const response = await fetch(`/api/comments`, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ commentId, content }),
  // });

  const response = await editBattleComment({ commentId, content });

  if (!response?.data?.success) {
    throw new Error("Failed to edit comment");
  }

  return response.data.updatedComment;
};

export const editCommentOptions = (updatedComment: CommentWithUser) => ({
  optimisticData: (comments: CommentWithUser[] = []) =>
    comments.map(comment =>
      comment.id === updatedComment.id ? updatedComment : comment
    ),
  rollbackOnError: true,
  populateCache: (updated: CommentWithUser, comments: CommentWithUser[] = []) =>
    comments.map(comment => (comment.id === updated.id ? updated : comment)),
  revalidate: false,
});
