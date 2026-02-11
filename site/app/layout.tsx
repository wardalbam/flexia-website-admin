import '../styles/globals.css'
import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Flexia Site',
  description: 'Publieke site voor Flexia vacatures',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <header className="border-b bg-white/50 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">Flexia Jobs</Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm hover:underline">Home</Link>
              <Link href="/vacatures" className="text-sm hover:underline">Vacatures</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">{children}</main>

        <footer className="border-t p-4 mt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Flexia Jobs
        </footer>
      </body>
    </html>
  )
}
