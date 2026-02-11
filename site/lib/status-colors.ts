export const statusLabels: Record<string, string> = {
  NEW: "Nieuw",
  REVIEWED: "Bekeken",
  CONTACTED: "Gecontacteerd",
  INTERVIEW_SCHEDULED: "Gesprek Gepland",
  HIRED: "Aangenomen",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Teruggetrokken",
};

export const statusColorClasses: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20",
  REVIEWED: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-500/20",
  CONTACTED: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/20",
  INTERVIEW_SCHEDULED: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-500/20",
  HIRED: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20",
  WITHDRAWN: "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border border-gray-500/20",
};

// Category colors
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Horeca": {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-500/20"
  },
  "Logistiek": {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-500/20"
  },
  "Productie": {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-500/20"
  },
  "Schoonmaak": {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-500/20"
  },
  "Zorg": {
    bg: "bg-pink-500/10",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-500/20"
  },
  default: {
    bg: "bg-gray-500/10",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-500/20"
  }
};

export function getCategoryColor(categoryName?: string | null) {
  if (!categoryName) return categoryColors.default;
  return categoryColors[categoryName] || categoryColors.default;
}

export function getStatusBadgeClasses(status: string): string {
  return statusColorClasses[status] || statusColorClasses.NEW;
}
