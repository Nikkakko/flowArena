import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const capitalize = (text: string): string => {
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

export const toUpperCase = (text: string): string => {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  if (/[ა-ჰ]/.test(text)) {
    return text.toLocaleUpperCase("ka-GE");
  } else if (/[a-zA-Z]/.test(text)) {
    return capitalize(text);
  }

  return text;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

export function checkUserVote(
  votes: { userId: string }[],
  userId?: string
): boolean {
  if (!userId) return false;
  return votes.some(vote => vote.userId === userId);
}
