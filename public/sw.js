/*
 * Moye service worker.
 *
 * Purpose: make the app work with the network switched off after one visit, which is
 * the product promise in docs/SPEC.md section 5. Strategy is deliberately simple:
 * cache first for our own GET requests, network only to fill the cache.
 *
 * There is no background sync and no push. Nothing leaves the device.
 */

const VERSION = "moye-v1";
const CACHE = `${VERSION}`;

/** The demo path and every screen a child or a teacher can reach. */
const PRECACHE = [
  "/",
  "/start",
  "/learn",
  "/lesson",
  "/done",
  "/hive",
  "/grownups",
  "/proof",
  "/manifest.webmanifest",
  "/moyin-192.png",
  "/moyin-512.png",
  "/moyin-maskable-512.png",
  "/fonts/OpenDyslexic-Regular.otf",
  "/fonts/OpenDyslexic-Bold.otf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Add one at a time: a single 404 must not fail the whole install.
      await Promise.all(
        PRECACHE.map(async (path) => {
          try {
            const res = await fetch(path, { cache: "reload" });
            if (res.ok) await cache.put(path, res);
          } catch {
            /* offline during install is fine, the runtime handler will fill it */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle our own GET requests. Never touch POST, never touch another origin.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the dev health probe or API responses: they must stay truthful.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(request, { ignoreSearch: true });

      if (hit) {
        // Refresh in the background so a redeploy is picked up on the next visit.
        event.waitUntil(
          fetch(request)
            .then((res) => (res.ok ? cache.put(request, res.clone()) : undefined))
            .catch(() => undefined),
        );
        return hit;
      }

      try {
        const res = await fetch(request);
        if (res.ok && res.type === "basic") {
          await cache.put(request, res.clone());
        }
        return res;
      } catch {
        // Offline and not cached: for a navigation, hand back the cached shell.
        if (request.mode === "navigate") {
          const shell = await cache.match("/");
          if (shell) return shell;
        }
        return new Response("Offline and not saved yet. Open Moye once with internet to save it.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })(),
  );
});
