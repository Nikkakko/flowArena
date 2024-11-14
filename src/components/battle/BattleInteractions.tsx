"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { checkUserVote, cn, toUpperCase } from "@/lib/utils";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { addVoteToBattle } from "@/lib/actions/battle-action";
import { useUser } from "@/lib/auth";
import { useOptimisticAction } from "next-safe-action/hooks";
import { Artist } from "@prisma/client";
import BattleArtistCard from "../cards/BattleArtistCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BattleInteractionsProps {
  votesCount: number;
  commentsCount: number;
  battleId: string;
  votes: Array<{ userId: string }>;
  artists: Artist[];
  winnerId: string | null;
}

export function BattleInteractions({
  votesCount: initialVotesCount,
  commentsCount,
  battleId,
  votes,
  artists,
  winnerId,
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
            "flex items-center text-white transition-all duration-200 ease-in-out active:scale-95",
            optimisticState.hasVoted && "bg-primary hover:bg-primary/90"
          )}
          onClick={async () => {
            if (!user) {
              toast({
                title: toUpperCase("გაიარეთ ავტორიზაცია"),
              });
              return;
            }
            execute({ battleId, hasVoted });
          }}
        >
          <ThumbsUp
            className={cn(
              "mr-2 h-4 w-4 transition-transform duration-200",
              optimisticState.hasVoted && "scale-110"
            )}
          />
          {optimisticState.count}
        </Button>

        <div className="flex items-center text-white border-none bg-transparent disabled:text-white select-none">
          <MessageSquare className="mr-2 h-4 w-4" />
          {toUpperCase(`კომენტარები (${commentsCount})`)}
        </div>
      </div>

      <div className="flex space-x-4 items-center">
        <div className="justify-start flex items-center space-x-2 my-3">
          <TooltipProvider delayDuration={100}>
            {artists.map(artist => (
              <Tooltip key={artist.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "border rounded-full h-10 w-10  hover:grayscale transition overflow-hidden flex items-center justify-center",
                      winnerId === null
                        ? "border-secondary"
                        : artist.id === winnerId
                        ? "border-success"
                        : "border-primary"
                    )}
                  >
                    <BattleArtistCard
                      artist={artist}
                      winner={artist.id === winnerId}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-primary text-white border-primary px-3 py-1.5"
                >
                  {toUpperCase(artist.nickName)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
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
    </div>
  );
}
