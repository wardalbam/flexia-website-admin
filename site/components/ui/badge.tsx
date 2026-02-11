import React from 'react'
import { cn } from '../../lib/utils'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800', className)}>{children}</span>
}

export default Badge
