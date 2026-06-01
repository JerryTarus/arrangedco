/** Tailwind gradient classes keyed by category slug. Used on both the
 *  categories index and the [slug] archive pages. */
export const categoryGradients: Record<string, string> = {
  kitchen: "from-amber-50 via-orange-100 to-amber-200",
  bedroom: "from-blue-50 via-indigo-50 to-blue-100",
  bathroom: "from-teal-50 via-cyan-50 to-teal-100",
  "living-room": "from-rose-50 via-pink-50 to-orange-50",
  "home-office": "from-slate-100 via-indigo-50 to-slate-200",
  closet: "from-stone-100 via-stone-50 to-amber-50",
  entryway: "from-amber-100 via-yellow-50 to-amber-50",
  garage: "from-gray-100 via-stone-100 to-gray-50",
} as const;

export function getGradient(slug: string): string {
  return categoryGradients[slug] ?? "from-stone-100 to-stone-50";
}
