import Link from "next/link";

export const metadata = {
  title: "Contact — Flexia",
  description: "Neem contact op met Flexia voor plaatsingen, ondersteuning of vragen.",
  openGraph: {
    title: "Contact — Flexia",
    description: "Neem contact op met Flexia voor plaatsingen, ondersteuning of vragen.",
    url: "https://www.flexiajobs.nl/contact",
    siteName: "Flexia",
    type: "website",
  },
};

export default function Page() {
  return (
    <main>
      <section className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-foreground">Contact</h1>
        <p className="mt-4 text-muted-foreground">Vragen over vacatures of het plaatsen van een vacature? Neem contact op via e-mail of telefoon.</p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold">Algemeen</h2>
            <p className="mt-2 text-sm text-muted-foreground">E-mail: <a href="mailto:info@flexiajobs.nl" className="text-[var(--brand)]">info@flexiajobs.nl</a></p>
            <p className="mt-1 text-sm text-muted-foreground">Telefoon: <a href="tel:+31123456789" className="text-[var(--brand)]">+31 12 345 6789</a></p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold">Voor werkgevers</h2>
            <p className="mt-2 text-sm text-muted-foreground">Direct hulp bij het plaatsen van een vacature? <Link href="/vacatures/new" className="text-[var(--brand)]">Plaats een vacature</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
