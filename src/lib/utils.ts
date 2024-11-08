import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toUpperGeorgian = (text: string): string => {
  return text.replace(/[ა-ჰ]/g, char => char.toLocaleUpperCase("ka-GE"));
};

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

function getGeorgianNumberCase(number: number, word: string): string {
  if (number === 1) return word + "ის";
  return word + "ის";
}

export function getRelativeTime(date: Date | string) {
  const now = new Date();
  const dateToCompare = new Date(date);

  const seconds = differenceInSeconds(now, dateToCompare);
  const minutes = differenceInMinutes(now, dateToCompare);
  const hours = differenceInHours(now, dateToCompare);
  const days = differenceInDays(now, dateToCompare);
  const months = differenceInMonths(now, dateToCompare);
  const years = differenceInYears(now, dateToCompare);

  if (seconds < 60) return "წუთის წინ";
  if (minutes < 60)
    return `${minutes} ${getGeorgianNumberCase(minutes, "წუთ")} წინ`;
  if (hours < 24) return `${hours} ${getGeorgianNumberCase(hours, "საათ")} წინ`;
  if (days < 30) return `${days} ${getGeorgianNumberCase(days, "დღ")} წინ`;
  if (months < 12)
    return `${months} ${getGeorgianNumberCase(months, "თვ")} წინ`;
  return `${years} ${getGeorgianNumberCase(years, "წელ")} წინ`;
}

// Add this utility function
export const getYouTubeVideoId = (url: string) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
    /^[a-zA-Z0-9_-]{11}$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return url; // Return as-is if no pattern matches
};
