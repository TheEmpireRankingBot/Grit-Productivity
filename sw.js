// Grand Horizon service worker — makes the app installable and offline-capable.
// Bump CACHE when shell assets change to force an update on next visit.
const CACHE = 'grand-horizon-v2';
const RUNTIME = 'grand-horizon-runtime';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigations: network-first (fresh app on reload), fall back to cached shell offline.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  // Same-origin assets: cache-first, then populate.
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  // Cross-origin (CDN scripts, fonts): stale-while-revalidate into a runtime cache,
  // so the app keeps working after the first online load.
  event.respondWith(
    caches.open(RUNTIME).then((cache) =>
      cache.match(req).then((hit) => {
        const net = fetch(req)
          .then((res) => { cache.put(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      })
    )
  );
});
