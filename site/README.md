# Flexia Public Site (separate Next app)

This folder contains a minimal Next.js app (`/site`) that uses the admin repo's API for public vacancy listings and application submissions.

Quick start

1. Copy env example and point to the admin backend:

```bash
cp .env.example .env.local
# edit .env.local and set NEXT_PUBLIC_API_BASE to your admin backend, e.g. http://localhost:3000
```

2. Install dependencies and run dev server:

```bash
cd site
npm install
npm run dev
```

3. Open the site:

- http://localhost:3000 (when run inside this site app it will default to port 3000; change port with `-p` if needed)
- The site will call the admin backend API at the URL set in `NEXT_PUBLIC_API_BASE`.

Notes

- This scaffold is intentionally minimal. It uses Tailwind CSS; after `npm install` run the dev server and Tailwind will compile.
- The public pages:
  - `/` - landing
  - `/vacatures` - vacancies listing (fetches `/api/vacatures?active=true` from the admin backend)
  - `/vacatures/:id/apply` - application form that POSTS to `/api/applications`

- If you want the site to be served on a different port (e.g. 3001) and the admin on 3000, set `NEXT_PUBLIC_API_BASE` to `http://localhost:3000` and run the site with `PORT=3001 npm run dev`.

Next steps I can help with

- Add shadcn (shadcn/ui) components and copy the design system from the admin app.
- Add more filtering/search on the vacancies page.
- Add SEO/meta tags and structured data.

If you'd like I can now install and wire the shadcn components in this `site` app (it requires adding the component library and the same UI primitives). Tell me to proceed and I'll add the dependency and example components.