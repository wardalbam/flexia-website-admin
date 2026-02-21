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
  background: "hsl(210 10% 90%)",
  color: "#0a0a0a",
};

export function getCategoryColor(categoryName?: string | null) {
  if (!categoryName) return defaultCategoryColor;

  // Deterministically hash the category name to a hue value
  const h = hashStringToInt(categoryName);
  const hue = h % 360; // 0-359

  // Use HSL to generate visually distinct, vibrant backgrounds
  const saturation = 72; // percent
  const lightness = 55; // percent for background
  const bg = `hsl(${hue} ${saturation}% ${lightness}%)`;

  // Border: slightly darker
  const borderLightness = Math.max(28, lightness - 12);
  const border = `hsl(${hue} ${Math.max(50, saturation - 10)}% ${borderLightness}%)`;

  // Decide text color (black or white) based on background luminance
  // Convert HSL to RGB to compute relative luminance
  function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  }

  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const text = luminance > 0.6 ? "#0a0a0a" : "#ffffff";

  // Return both legacy keys (bg/text) and new inline-friendly keys (background/color)
  return {
    // legacy Tailwind-like keys kept for backward compatibility
    bg: bg,
    text: text,
    border,
    accent: `hsl(${hue} ${saturation}% ${Math.max(35, lightness - 20)}%)`,
    // inline style friendly keys
    background: bg,
    color: text,
  };
}
