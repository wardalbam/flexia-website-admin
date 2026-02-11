export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Horeca": { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/20" },
  "Zorg": { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-300", border: "border-blue-500/20" },
  "Logistiek": { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-300", border: "border-purple-500/20" },
  "Retail": { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-300", border: "border-green-500/20" },
  "Productie": { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-500/20" },
  "default": { bg: "bg-gray-500/10", text: "text-gray-700 dark:text-gray-300", border: "border-gray-500/20" },
};

export function getCategoryColor(categoryName?: string | null) {
  if (!categoryName) return categoryColors.default;
  return categoryColors[categoryName] || categoryColors.default;
}
