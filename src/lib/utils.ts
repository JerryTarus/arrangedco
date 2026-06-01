import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import slugifyLib from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return slugifyLib(text, { lower: true, strict: true });
}

export function formatDate(date: string | Date, pattern = "MMMM d, yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://arranged.co"}${path}`;
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.slice(0, length)}…` : str;
}

