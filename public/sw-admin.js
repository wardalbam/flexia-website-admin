// Basic service worker for the admin app. This caches the shell and
// provides a simple runtime cache for API requests. Keep this small and
// focused on admin-only routes/assets.
const CACHE_NAME = "flexia-admin-shell-v1";
const RUNTIME_CACHE = "flexia-admin-runtime-v1";

// Minimal precache list. In production you might generate a full precache
// list that includes built /_next assets. Keep this conservative here.
const SHELL_URLS = [
  "/",
  "/manifest-admin.json",
  "/favicon.ico",
  "/globe.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests (do not proxy third-party assets)
  if (url.origin !== location.origin) return;

  // Network-first for API requests: try network, update runtime cache, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          try {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          } catch (e) {
            // ignore caching errors
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for static assets like /_next/static and images
  if (url.pathname.startsWith("/_next/static") || url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".svg") || url.pathname.endsWith(".webp")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          try {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          } catch (e) {}
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  // For navigation (HTML) requests, try cache first then network, but update cache
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/", { ignoreSearch: true }).then((cachedRoot) => {
        return fetch(request)
          .then((response) => {
            // update shell cache in background
            try {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            } catch (e) {}
            return response;
          })
          .catch(() => cachedRoot || caches.match(request));
      })
    );
    return;
  }

  // Default: cache-first then network for other assets
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
