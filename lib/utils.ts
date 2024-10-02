import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateYoutubeUrl(url: string) {
  const regex =
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(playlist\?list=)([A-Za-z0-9_-]+)$/;
  return regex.test(url);
}