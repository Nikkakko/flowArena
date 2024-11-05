"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment, User } from "@prisma/client";
import { toUpperCase } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface CommentWithUser extends Comment {
  user: User;
}

interface BattleCommentsSectionProps {
  comments: CommentWithUser[];
}

export function BattleCommentsSection({
  comments,
}: BattleCommentsSectionProps) {
  const [comment, setComment] = useState("");
  // In parent component
  const commentRef = React.useRef<HTMLTextAreaElement>(null);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    setComment("");
  };

  return (
    <>
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <Textarea
          placeholder={toUpperCase("დაწერეთ კომენტარი...")}
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="mb-2"
          ref={commentRef}
        />
        <Button type="submit" className="text-white">
          {toUpperCase("კომენტარის დამატება")}
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={"/assets/artist-placeholder.webp"} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleString("ka-GE")}
              </p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
