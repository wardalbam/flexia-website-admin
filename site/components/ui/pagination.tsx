import React from 'react'
import Link from 'next/link'
import { cn } from '../../lib/utils'

export default function Pagination({ page, totalPages, basePath, queryParams }: { page: number; totalPages: number; basePath: string; queryParams?: Record<string,string> }) {
  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...(queryParams || {}), page: String(p) })
    return `${basePath}?${params.toString()}`
  }

  return (
    <nav className="flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={buildHref(page - 1)} className="px-3 py-1 border rounded">Vorige</Link>
      )}
      <span className="px-3 py-1 text-sm text-muted-foreground">Pagina {page} van {totalPages}</span>
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className="px-3 py-1 border rounded">Volgende</Link>
      )}
    </nav>
  )
}
