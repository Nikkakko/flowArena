"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { checkUserVote, cn, toUpperCase } from "@/lib/utils";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { addVoteToBattle } from "@/lib/actions/battle-action";
import { useUser } from "@/lib/auth";
import { useOptimisticAction } from "next-safe-action/hooks";

interface BattleInteractionsProps {
  votesCount: number;
  commentsCount: number;
  battleId: string;
  votes: Array<{ userId: string }>;
}

export function BattleInteractions({
  votesCount: initialVotesCount,
  commentsCount,
  battleId,
  votes,
}: BattleInteractionsProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const hasVoted = checkUserVote(votes, user?.id);

  const { execute, optimisticState } = useOptimisticAction(addVoteToBattle, {
    currentState: { count: initialVotesCount, hasVoted },
    updateFn: state => ({
      count: state.hasVoted ? state.count - 1 : state.count + 1,
      hasVoted: !state.hasVoted,
    }),
  });

  const handleCopyUrl = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: toUpperCase("ლინკი დაკოპირებულია"),
    });
  }, [toast]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className={cn(
            "flex items-center text-white",
            optimisticState.hasVoted && "bg-primary hover:bg-primary/90"
          )}
          onClick={() => {
            if (!user) {
              toast({
                title: toUpperCase("გაი���რეთ ავტორიზაცია"),
              });
              return;
            }
            execute({ battleId, userId: user.id, hasVoted });
          }}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          {optimisticState.count}
        </Button>

        <div className="flex items-center text-white border-none bg-transparent disabled:text-white select-none">
          <MessageSquare className="mr-2 h-4 w-4" />
          {toUpperCase(`კომენტარები (${commentsCount})`)}
        </div>
      </div>

      <Button
        variant="outline"
        className="flex items-center text-white"
        type="button"
        onClick={handleCopyUrl}
      >
        <Share2 className="mr-2 h-4 w-4" />
        {toUpperCase("გაზიარება")}
      </Button>
    </div>
  );
}
