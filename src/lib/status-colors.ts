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
export const categoryColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "IT & Technology": {
    bg: "bg-blue-500/15 dark:bg-blue-500/25",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-500/30 dark:border-blue-500/40",
    accent: "bg-blue-500"
  },
  "Healthcare": {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30 dark:border-emerald-500/40",
    accent: "bg-emerald-500"
  },
  "Finance": {
    bg: "bg-purple-500/15 dark:bg-purple-500/25",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-500/30 dark:border-purple-500/40",
    accent: "bg-purple-500"
  },
  "Marketing": {
    bg: "bg-pink-500/15 dark:bg-pink-500/25",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-500/30 dark:border-pink-500/40",
    accent: "bg-pink-500"
  },
  "Sales": {
    bg: "bg-orange-500/15 dark:bg-orange-500/25",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-500/30 dark:border-orange-500/40",
    accent: "bg-orange-500"
  },
  "Education": {
    bg: "bg-indigo-500/15 dark:bg-indigo-500/25",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-500/30 dark:border-indigo-500/40",
    accent: "bg-indigo-500"
  },
  "Logistics": {
    bg: "bg-amber-500/15 dark:bg-amber-500/25",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30 dark:border-amber-500/40",
    accent: "bg-amber-500"
  },
  "Customer Service": {
    bg: "bg-teal-500/15 dark:bg-teal-500/25",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-500/30 dark:border-teal-500/40",
    accent: "bg-teal-500"
  },
  "Construction": {
    bg: "bg-yellow-500/15 dark:bg-yellow-500/25",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-500/30 dark:border-yellow-500/40",
    accent: "bg-yellow-500"
  },
  "Hospitality": {
    bg: "bg-rose-500/15 dark:bg-rose-500/25",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-500/30 dark:border-rose-500/40",
    accent: "bg-rose-500"
  },
  "Legal": {
    bg: "bg-slate-500/15 dark:bg-slate-500/25",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-500/30 dark:border-slate-500/40",
    accent: "bg-slate-500"
  },
  "Manufacturing": {
    bg: "bg-zinc-500/15 dark:bg-zinc-500/25",
    text: "text-zinc-700 dark:text-zinc-300",
    border: "border-zinc-500/30 dark:border-zinc-500/40",
    accent: "bg-zinc-500"
  }
};

// Fallback for unknown categories
const defaultCategoryColor = {
  bg: "bg-gray-500/15 dark:bg-gray-500/25",
  text: "text-gray-700 dark:text-gray-300",
  border: "border-gray-500/30 dark:border-gray-500/40",
  accent: "bg-gray-500"
};

export function getCategoryColor(category: string) {
  return categoryColors[category] || defaultCategoryColor;
}
