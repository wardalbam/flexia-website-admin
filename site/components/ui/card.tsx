import React from 'react'
import { cn } from '../../lib/utils'

export function Card({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('bg-white border rounded-lg shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
