// lib/utils.ts
// General-purpose utility functions — no React, no Supabase

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind classes safely — always use this for conditional classNames */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Format a probability (0–1) as a percentage string e.g. "72%" */
export function formatPercent(p: number, decimals = 0): string {
  return `${(p * 100).toFixed(decimals)}%`
}

/** Format a date string to "Jan 2025" */
export function formatMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GH", {
    month: "short",
    year: "numeric",
  })
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/** Truncate text to maxLength characters, adding ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

/** Get ordinal suffix: 1st, 2nd, 3rd, 4th... */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

/** Deep equality check for simple objects (JSON-comparable) */
export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Safe JSON parse — returns null on error instead of throwing */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
