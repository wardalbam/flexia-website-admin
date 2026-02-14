// Helper to resolve API base URL consistently across server and client.
// Priority:
// 1. NEXT_PUBLIC_API_URL (explicit env set for the site)
// 2. In production, fall back to the known admin host (production admin)
// 3. VERCEL_URL when available (server-side)
// 4. Empty string (use same-origin relative paths)

export function getApiBase() {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured && configured.length > 0) return configured.replace(/\/$/, "");

  // If running in production and no NEXT_PUBLIC_API_URL is provided,
  // use the admin production host as a last-resort fallback so the
  // public site can reach the API when deployed separately.
  if (process.env.NODE_ENV === "production") {
    return "https://admin.flexiajobs.nl";
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return ""; // empty => use relative paths (same-origin)
}

export function apiUrl(path: string) {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base) return `${base}${p}`;

  // Client-side: use window origin when no base is configured
  if (typeof window !== "undefined") return `${window.location.origin}${p}`;

  // Server-side: return relative path so SSR will fetch from same origin
  return p;
}
