import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Arabic text for consistent comparison and deduplication.
 * Handles common typing inconsistencies in Arabic data:
 *  - Alef variants (أ إ آ ٱ) → plain alef (ا)
 *  - Ta marbuta (ة) → ha (ه)
 *  - Strips diacritics / tashkeel
 */
export function normalizeArabic(str: string): string {
  return str
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[\u064B-\u065F\u0670]/g, "");
}
