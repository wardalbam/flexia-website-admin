"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          selectedVacatures: [id],
          availability: [],
          source: 'website',
          vacatureId: id,
        }),
      });

      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push('/site/vacatures'), 1500);
      } else {
        const err = await res.json();
        alert('Fout bij verzenden: ' + JSON.stringify(err));
      }
    } catch (err) {
      alert('Fout bij verzenden');
    } finally {
      setLoading(false);
    }
  };

  if (success) return <div className="p-4 text-center">Bedankt — je sollicitatie is verzonden.</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Solliciteer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Voornaam</label>
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Achternaam</label>
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Telefoon</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex gap-2">
          <button disabled={loading} className="bg-primary text-primary-foreground px-3 py-2 rounded">{loading ? 'Verzenden...' : 'Verzenden'}</button>
          <button type="button" onClick={() => router.push('/site/vacatures')} className="px-3 py-2 border rounded">Annuleren</button>
        </div>
      </form>
    </div>
  );
}
