"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, toUpperCase } from "@/lib/utils";
import { ThumbsUp, MessageSquare, Share2, ThumbsDown } from "lucide-react";
import {
  addVoteToBattle,
  removeVoteFromBattle,
} from "@/lib/actions/battle-action";
import { useUser } from "@/lib/auth";

interface BattleInteractionsProps {
  votesCount: number;
  commentsCount: number;
  battleId: string;
}

export function BattleInteractions({
  votesCount,
  commentsCount,
  battleId,
}: BattleInteractionsProps) {
  const [isPending, startTransition] = React.useTransition();
  const { user } = useUser();
  const { toast } = useToast();
  const interactionsList = [
    {
      id: "1",
      icon: ThumbsUp,
      text: "ხმის მიცემა",
      count: votesCount,
    },
    {
      id: "2",
      icon: ThumbsDown,
      text: null,
    },
  ];

  const handleCopyUrl = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href);

    toast({
      title: toUpperCase("ლინკი დაკოპირებულია"),
    });
  }, [toast]);

  //handle focus on comment textarea with useImperativeHandle

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        {interactionsList.map(({ icon: Icon, text, count, id }) => (
          <Button
            key={text}
            variant="outline"
            className={cn("flex items-center text-white")}
            onClick={() => {
              startTransition(() => {
                switch (id) {
                  case "1":
                    if (!user) return;
                    addVoteToBattle({
                      battleId,
                      userId: user.id,
                    });
                    break;
                  case "2":
                    if (!user) return;
                    removeVoteFromBattle({
                      battleId,
                      userId: user.id,
                    });
                    break;
                  default:
                    return;
                }
              });
            }}
            disabled={isPending}
          >
            <Icon className=" h-4 w-4" />
            {text && `${toUpperCase(text)} (${count})`}
          </Button>
        ))}
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
