import * as LucideIcons from "lucide-react";

import React from "react";

interface CategoryIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CategoryIcon({ icon, className = "h-5 w-5", style }: CategoryIconProps) {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Briefcase;
  return <IconComponent className={className} style={style} />;
}
