# Connecting an external frontend to the Flexia Admin API

This document explains how to connect a separate frontend (a website or SPA hosted elsewhere) to this Next.js-based admin/backend project. It lists API endpoints, authentication details, recommended connection approaches, example requests, environment variables you need to set, and common pitfalls (CORS/cookies).

> Assumption: the backend project runs at a public URL (for example `https://admin.example.com` or `http://localhost:3000` for local development). Replace `https://admin.example.com` in examples below with your backend base URL.

---

## Quick summary / recommendation

- If your frontend is another Next.js app that you control and can host under the same domain (or a subpath), the easiest & most secure approach is to use NextAuth on the backend and the NextAuth client on the frontend so authentication and session cookies work automatically.
- If your frontend is a separate origin (different domain), you have two main options:
  1. Keep using the backend NextAuth cookie-based session but host the frontend under the same parent domain (or use a reverse proxy) so cookies are sent; OR
  2. Implement a token-based integration (server-to-server) — create an API token or JWT that your frontend can send in an `Authorization` header. This repo does not include an API-key system by default; I provide guidance for both options below.

---

## Base URL and endpoints (available in this project)

Replace `{BASE}` with your backend base URL (for local dev `http://localhost:3000`).

Public endpoints (no auth required):

- GET {BASE}/api/vacatures
  - Query params: `active` (true|false), `category`, `location`
  - Returns: array of vacatures (with application counts)

- GET {BASE}/api/vacatures/:id
  - `:id` can be an id or slug
  - Returns single vacature object

- POST {BASE}/api/applications
  - Accepts public application submissions (site-to-backend).
  - Payload (JSON):
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "0612345678",
      "birthDate": "1990-01-01",           // optional
      "city": "Rotterdam",                // optional
      "gender": "male",                   // optional
      "experience": "...",                // optional
      "selectedVacatures": ["id1","id2"],
      "availability": ["weekdays"],
      "vacatureId": "<vacature-id>",      // optional
      "source": "website"                 // default "website"
    }
  - Response: created application (201) or validation error (400)

Protected endpoints (require an authenticated admin session):

- GET {BASE}/api/applications
  - Query params: `status`, `search`, `page`, `limit`
  - Response: { applications: [...], pagination: { page, limit, total, totalPages } }

- GET {BASE}/api/applications/:id
  - Protected. Returns the application record (200), or 404.

- PATCH {BASE}/api/applications/:id
  - Protected. Payload: { status?: "NEW" | "REVIEWED" | "CONTACTED" | "INTERVIEW_SCHEDULED" | "HIRED" | "REJECTED" | "WITHDRAWN", notes?: string }
  - Returns updated application

- DELETE {BASE}/api/applications/:id
  - Protected. Deletes application.

- POST {BASE}/api/vacatures
  - Protected. Create vacature. See server-side schema for required fields (title, subtitle, slug, vacatureNumber, description, longDescription, seoContent, requirements[], benefits[], category, imageKey, employmentType[], location, salary, isActive)

- GET {BASE}/api/vacatures (already listed: supports query filters)
- GET {BASE}/api/vacatures/:id (public)
- PUT {BASE}/api/vacatures/:id (Protected) — update vacature
- DELETE {BASE}/api/vacatures/:id (Protected)

- GET {BASE}/api/dashboard/stats (Protected) — aggregated dashboard stats & recent applications
- POST {BASE}/api/settings/password (Protected) — change current user's password (payload: { currentPassword, newPassword })

Authentication endpoints (NextAuth handlers):

- NextAuth endpoints are exposed under `{BASE}/api/auth/*` (this project uses NextAuth with a Credentials provider). Use the NextAuth client SDK on same-origin clients or the HTTP endpoints with credentials included as explained below.

---

## Authentication details & recommended flows

This backend uses NextAuth with a Credentials provider (email + password). Sessions are JWT-backed and stored in httpOnly cookies.

Two common scenarios and how to implement them:

A) Frontend on same origin (recommended)

- Host your frontend under the same scheme + domain (or subdomain configured so cookies are shared). Then you can sign in using the NextAuth client or by POSTing credentials to the NextAuth endpoint and letting the cookie be set.

Example (browser fetch, same-origin):

```js
// Sign in (POST to credentials callback). This example uses the built-in NextAuth credentials callback path.
await fetch('/api/auth/callback/credentials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  credentials: 'include',
  body: new URLSearchParams({ email: 'admin@example.com', password: 'hunter2' })
});

// After sign-in, get session:
const sessionRes = await fetch('/api/auth/session', { credentials: 'include' });
const session = await sessionRes.json();

// Call protected API (must include credentials so cookie is sent):
const res = await fetch('/api/applications', { credentials: 'include' });
const data = await res.json();
```

Note: the exact sign-in callback path depends on NextAuth; using the NextAuth client library (`next-auth/react`) inside a Next.js frontend is simpler.

B) Frontend on a separate origin (different domain)

Cross-site cookies are restricted by the browser. You have three realistic options:

1. Reverse proxy / same-site hosting (best security & least friction)
   - Put the frontend behind the same domain (e.g., `app.example.com` and `admin.example.com` with cookie domain `.example.com`) or configure a reverse proxy so both the SPA and backend appear under the same origin.
   - This allows using cookies and the existing session flow with `credentials: 'include'`.

2. Implement a token-based login (server-to-server):
   - Add a new API route on the backend that issues a stable API token (or mint a short-lived JWT) for service access. Store the token in DB with limited permissions.
   - The external frontend sends `Authorization: Bearer <token>` in requests to protected endpoints. You will need to implement middleware on protected routes to accept such tokens (not included by default).

3. Client-side authentication + cookie sharing with explicit cookie settings (complex + fragile):
   - Configure your cookie domain and SameSite attributes so the cookie is accepted cross-site. This is hard and unreliable across browsers.

If you choose option 2 (token-based), I can scaffold a minimal `POST /api/token` route and middleware to accept `Authorization` headers and map them to a user context.

---

## Example requests

1) Public: fetch vacatures (client-side)

```js
const res = await fetch('https://admin.example.com/api/vacatures?active=true', { method: 'GET' });
const vacatures = await res.json();
```

2) Submit application (public)

```js
const payload = {
  firstName: 'Anna',
  lastName: 'Bakker',
  email: 'anna@example.com',
  phone: '0612345678',
  selectedVacatures: ['cj0...'],
  availability: ['weekdays'],
  vacatureId: 'cj0...',
};

const res = await fetch('https://admin.example.com/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (res.status === 201) {
  const created = await res.json();
  console.log('Application created', created);
} else {
  console.error('Failed', await res.json());
}
```

3) Protected: list applications (requires session cookie)

```js
// After signing in (see auth section), include credentials so cookies are sent
const res = await fetch('https://admin.example.com/api/applications', { credentials: 'include' });
const body = await res.json();
```

4) Update application (protected)

```js
await fetch('https://admin.example.com/api/applications/<id>', {
  method: 'PATCH',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'REVIEWED', notes: 'Called candidate' }),
});
```

---

## Environment variables required (backend)

The backend requires these environment variables to work properly (set in `.env.local` for local dev):

- NEXTAUTH_SECRET - a long random secret for NextAuth JWT signing (required)
- NEXTAUTH_URL - the canonical URL for the site (e.g. `http://localhost:3000` or `https://admin.example.com`)
- POSTGRES_PRISMA_URL - the Prisma datasource URL (Postgres connection string used by Prisma)
- POSTGRES_URL_NON_POOLING - Prisma directUrl (used by Prisma in some environments)

Notes:
- Never commit `.env.local` with secrets to source control.
- If you run NextAuth behind a proxy or with a different domain, set NEXTAUTH_URL to the public URL (where users access the admin).

---

## CORS and cookies: practical guidance

If your frontend is on the *same origin* as the backend (recommended), no special CORS configuration is required. Always call `fetch(..., { credentials: 'include' })` when you want the browser to send/receive auth cookies.

If your frontend is on a *different origin* you will run into browser cookie restrictions (SameSite, cross-site). The reliable solutions are:

- Host the frontend under the same top-level domain or use a reverse proxy so the cookie is considered same-site.
- Implement token-based auth for API calls (Authorization bearer tokens). This requires adding token issuing and validation to the backend (I can add a minimal implementation if you want).

---

## Response shapes & validation

- Application POST/response: returns the created `Application` object. If validation fails you get status 400 with field errors in the JSON.
- Vacature endpoints return `Vacature` objects. See `prisma/schema.prisma` for the model fields.

---

## Developer notes (how to run & seed locally)

1. Setup `.env.local` with the environment variables listed above.
2. Install deps: `npm install`.
3. Generate Prisma client and push schema to DB:

```bash
# if using local Postgres or Neon, ensure POSTGRES_PRISMA_URL is set
npx prisma db push
# optional: run seed (the project includes prisma/seed.ts)
npx prisma db seed
```

4. Start dev server:

```bash
npm run dev
# or
next dev
```

---

## Common integration examples and troubleshooting

- If your frontend sign-in returns HTML or redirects instead of JSON, use the NextAuth client in a Next.js app instead of POSTing directly.
- To debug authentication: call `{BASE}/api/auth/session` from the frontend with `credentials: 'include'` and inspect the JSON session object.
- If you get `401` on protected routes, verify the request includes cookies (use the browser devtools network tab to confirm). If cookies are missing and your frontend is cross-origin, consider moving to same-origin or implementing token-based auth.

---

## Want me to wire token-based auth?
If you want to host the frontend on a different domain and prefer a bearer-token flow, I can:

- Add a minimal `POST /api/token` route that verifies admin credentials and returns a short-lived JWT or API token.
- Add a small middleware helper to authenticate requests using `Authorization: Bearer <token>` for the protected API routes.

Tell me if you'd like that and whether tokens should be long-lived (stored in DB) or short-lived JWTs.

---

If you'd like, I can also generate example TypeScript/React helper hooks (fetch wrappers) for the frontend that encapsulate calls to the API (including credentials handling). Tell me which frontend framework you're using (React, Next/Remix/Vue/Angular) and I will scaffold helpers.
