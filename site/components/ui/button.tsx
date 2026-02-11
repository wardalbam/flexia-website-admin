import React from 'react'
import { cn } from '../../lib/utils'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 rounded-md text-sm font-medium px-3 py-2'
  const variantClass =
    variant === 'outline'
      ? 'border bg-white hover:bg-gray-50'
      : variant === 'ghost'
      ? 'bg-transparent hover:bg-gray-50'
      : 'bg-blue-600 text-white hover:bg-blue-700'

  return <button className={cn(base, variantClass, className)} {...props} />
}

export default Button
