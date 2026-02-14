"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Ongeldige inloggegevens");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 surface-dark relative overflow-hidden">
      {/* Decorative mesh blob */}
      <div className="mesh-blob mesh-brand w-[600px] h-[600px] -top-40 left-1/4 opacity-30 animate-mesh" />

      <div className="w-full max-w-md relative z-10 glass-dark rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto mb-2 w-12 h-12 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] rounded-xl flex items-center justify-center shadow-md">
            <span className="text-black font-black text-lg">F</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            flexia<span className="text-[var(--brand)]">.</span> admin
          </h1>
          <p className="text-white/50 text-sm">Log in om het admin paneel te openen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80 text-sm">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus-visible:border-[var(--brand)] focus-visible:ring-[var(--brand)]/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80 text-sm">Wachtwoord</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus-visible:border-[var(--brand)] focus-visible:ring-[var(--brand)]/30"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full bg-[var(--brand)] text-black hover:bg-[var(--brand-light)] font-semibold h-11 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Inloggen..." : "Inloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
