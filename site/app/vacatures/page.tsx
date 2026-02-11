import Link from 'next/link'
import Card, { CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import Pagination from '../../components/ui/pagination'
import Badge from '../../components/ui/badge'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'

type SearchParams = { q?: string; category?: string; location?: string; page?: string }

export default async function VacaturesPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams || {}
  const q = params.q?.toLowerCase?.() || ''
  const category = params.category || ''
  const location = params.location || ''
  const page = parseInt(params.page || '1') || 1
  const pageSize = 10

  let vacatures: any[] = []
  let fetchError: string | null = null

  try {
    const res = await fetch(`${API_BASE}/api/vacatures?active=true`)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    vacatures = await res.json()
  } catch (err: any) {
    fetchError = err?.message || 'Kon vacatures niet laden'
    vacatures = []
  }

  // server-side filtering
  const filtered = vacatures.filter((v: any) => {
    if (category && v.category !== category) return false
    if (location && v.location !== location) return false
    if (q) {
      const hay = `${v.title} ${v.location} ${v.slug} ${v.vacatureNumber}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vacatures</h2>
        <p className="text-sm text-gray-600">{total} openstaande vacatures</p>
      </div>

      <Card>
        <CardContent>
          <form method="GET" className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="flex-1">
              <Input name="q" defaultValue={q} placeholder="Zoek op functie, locatie of nummer" className="w-full" />
            </div>
            <div className="w-48">
              <Input name="location" defaultValue={location} placeholder="Locatie" />
            </div>
            <div className="w-48">
              <Input name="category" defaultValue={category} placeholder="Categorie" />
            </div>
            <div className="flex-shrink-0">
              <Button type="submit">Zoeken</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {fetchError ? (
        <div className="p-4 text-red-600">{fetchError}</div>
      ) : (
        <div className="grid gap-3">
          {pageItems.map((v: any) => (
            <Link key={v.id} href={`/vacatures/${v.id}/apply`} className="p-4 border rounded hover:shadow flex items-center justify-between">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-xs text-gray-600">{v.location}</p>
                <div className="mt-2"><Badge>{v.category}</Badge></div>
              </div>
              <div className="text-right text-xs text-gray-600">
                <div>#{v.vacatureNumber}</div>
                <div>{v._count?.applications ?? 0} sollicitaties</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath={'/vacatures'} queryParams={{ ...(q ? { q } : {}), ...(category ? { category } : {}), ...(location ? { location } : {}) }} />
    </div>
  )
}
