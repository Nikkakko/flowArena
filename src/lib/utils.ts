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
