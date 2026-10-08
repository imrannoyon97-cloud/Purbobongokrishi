self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('purbobongo-store').then((cache) => cache.addAll([
      '/Purbobongokrishi/',
      '/Purbobongokrishi/index.html'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
