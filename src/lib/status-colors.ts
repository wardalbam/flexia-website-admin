// Centralized status color definitions for consistent styling across the application

export const statusLabels: Record<string, string> = {
  NEW: "Nieuw",
  REVIEWED: "Bekeken",
  CONTACTED: "Gecontacteerd",
  INTERVIEW_SCHEDULED: "Gesprek Gepland",
  HIRED: "Aangenomen",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Teruggetrokken",
};

// Modern status colors with proper contrast and dark mode support
export const statusColorClasses: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20",
  REVIEWED: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-500/20",
  CONTACTED: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/20",
  INTERVIEW_SCHEDULED: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-500/20",
  HIRED: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20",
  WITHDRAWN: "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border border-gray-500/20",
};

// Utility function to get status badge classes
export function getStatusBadgeClasses(status: string): string {
  return statusColorClasses[status] || statusColorClasses.NEW;
}

// Category color classes for visual differentiation with vibrant, distinct colors
// Instead of hardcoding colors per category, compute (deterministic) "random"
// Tailwind-class variants based on the category name. This gives each
// category a distinct color while keeping classes valid Tailwind tokens.
// We use a simple hash of the category name to pick a base color from a
// palette so colors are stable across runs for the same category.

const BASE_PALETTE = [
  "blue",
  "emerald",
  "purple",
  "pink",
  "orange",
  "indigo",
  "amber",
  "teal",
  "yellow",
  "rose",
  "slate",
  "zinc",
];

function hashStringToInt(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const defaultCategoryColor = {
  bg: "bg-gray-500/15 dark:bg-gray-500/25",
  text: "text-gray-700 dark:text-gray-300",
  border: "border-gray-500/30 dark:border-gray-500/40",
  accent: "bg-gray-500",
};

export function getCategoryColor(categoryName?: string | null) {
  if (!categoryName) return defaultCategoryColor;

  // Pick a base color deterministically from the palette using a hash
  const h = hashStringToInt(categoryName);
  const base = BASE_PALETTE[h % BASE_PALETTE.length];

  // Build Tailwind class strings using the selected base color
  const bg = `bg-${base}-500/30 dark:bg-${base}-500/40`;
  const text = `text-${base}-800 dark:text-${base}-200`;
  const border = `border-${base}-500/50 dark:border-${base}-500/60`;
  const accent = `bg-${base}-500`;

  return { bg, text, border, accent };
}
