"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment, User } from "@prisma/client";
import { getRelativeTime, toUpperCase } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { EditIcon, Trash2Icon } from "lucide-react"; // Add this import for delete icon
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { commentSchema } from "@/lib/validation";
import useSWR from "swr";
import {
  addCommentOptions,
  deleteComment,
  fetcher,
  deleteCommentOptions,
  addCommentToBattle,
  editComment,
  editCommentOptions,
} from "@/lib/swr";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CommentWithUser extends Comment {
  user: User;
}

interface BattleCommentsSectionProps {
  comments: CommentWithUser[];
  battleId: string;
}

export function BattleCommentsSection({
  comments: initialComments,
  battleId,
}: BattleCommentsSectionProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate, data: comments } = useSWR(
    `/api/comments?battleId=${battleId}`,
    {
      fetcher,
      revalidateOnFocus: true,
      fallbackData: initialComments, // Add this line
    }
  );

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof commentSchema>) {
    if (!user) {
      toast({
        title: toUpperCase("გაიარეთ ავტორიზაცია"),
      });
      return;
    }

    const newComment: CommentWithUser = {
      id: Math.random().toString(),
      content: values.content,
      createdAt: new Date(),
      battleId,
      likes: 0,
      userId: user.id,
      user: user,
    };

    mutate(
      addCommentToBattle(battleId, values.content),
      addCommentOptions(newComment)
    );

    form.reset();
  }

  const handleDelete = (commentId: string) => {
    if (!user) return;
    mutate(deleteComment(commentId), deleteCommentOptions(commentId));
  };

  // Add edit handler
  const handleEdit = async (commentId: string, content: string) => {
    if (!user) return;

    const updatedComment: CommentWithUser = {
      ...comments?.find((c: CommentWithUser) => c.id === commentId)!,
      content: content,
    };

    try {
      mutate(
        editComment(commentId, content),
        editCommentOptions(updatedComment)
      );
      setIsEditing(null);
    } catch (error) {
      toast({
        title: toUpperCase("კომენტარის რედაქტირება ვერ მოხერხდა"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-4 border-b  space-y-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={toUpperCase("დაწერეთ კომენტარი...")}
                    className=" text-white"
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="text-white">
            {toUpperCase("კომენტარის დამატება")}
          </Button>
        </form>
      </Form>
      <div className="space-y-4 mt-10 ">
        {comments?.map((comment: CommentWithUser) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={"/assets/artist-placeholder.webp"} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">
                    {comment.user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {toUpperCase(getRelativeTime(comment.createdAt))}
                  </p>
                </div>
                {user && user.id === comment.userId && (
                  <div className="flex items-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/50 hover:text-secondary"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {toUpperCase("კომენტარის წაშლა")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {toUpperCase("ნამდვილად გსურთ კომენტარის წაშლა?")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {toUpperCase("გაუქმება")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(comment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {toUpperCase("წაშლა")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/50 hover:text-secondary"
                      onClick={() => setIsEditing(comment.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {isEditing === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    defaultValue={comment.content}
                    onChange={e => setEditContent(e.target.value)}
                    className="text-white mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(comment.id, editContent)}
                      className="text-white"
                    >
                      {toUpperCase("შენახვა")}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(null)}
                      className="text-white"
                    >
                      {toUpperCase("გაუქმება")}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-white/50">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
