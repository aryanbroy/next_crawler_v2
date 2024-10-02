import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const YT_REGEX = new RegExp(
  "^(?:https?://)?(?:www.)?youtube.com/playlist?list=[A-Za-z0-9_-]+$"
);
