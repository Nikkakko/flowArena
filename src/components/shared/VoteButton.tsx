"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoteButtonProps {
  hasVoted: boolean;
  toggleVote: () => void;
}

export default function VoteButton({ hasVoted, toggleVote }: VoteButtonProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Button
        onClick={toggleVote}
        className="relative w-12 h-12 rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <AnimatePresence initial={false} mode="wait">
          {hasVoted ? (
            <motion.div
              key="thumbsDown"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ThumbsDownIcon className="w-6 h-6 text-red-500" />
            </motion.div>
          ) : (
            <motion.div
              key="thumbsUp"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ThumbsUpIcon className="w-6 h-6 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
