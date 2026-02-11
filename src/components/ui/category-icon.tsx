import * as LucideIcons from "lucide-react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function CategoryIcon({ icon, className = "h-5 w-5" }: CategoryIconProps) {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Briefcase;
  return <IconComponent className={className} />;
}
