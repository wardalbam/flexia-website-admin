import Link from 'next/link'

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-extrabold">Vind je volgende baan bij Flexia</h1>
        <p className="mt-4 text-gray-600">Bekijk vacatures in jouw regio en solliciteer direct.</p>
        <div className="mt-6">
          <Link href="/vacatures" className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium">Zoek vacatures</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Snelle sollicitatie</div>
        <div className="p-4 border rounded">Eenvoudig zoeken</div>
        <div className="p-4 border rounded">Direct contact</div>
      </div>
    </section>
  )
}
