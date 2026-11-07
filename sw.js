const CACHE = 'perkakasid-v2';
const BERKAS = [
  'index.html',
  'styles.css',
  'lang.js',
  'app.js',
  'manifest.webmanifest',
  'tools/terbilang.js',
  'tools/penghitung-kata.js',
  'tools/json-formatter.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BERKAS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((daftar) =>
      Promise.all(daftar.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((tercacher) => {
      if (tercacher) return tercacher;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const salin = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, salin));
        }
        return res;
      });
    })
  );
});
