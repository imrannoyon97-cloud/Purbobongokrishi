/* পূর্ববঙ্গ কৃষি কেন্দ্র — Service Worker
   নিয়ম: page/JS সবসময় আগে network থেকে (নতুন version), offline হলে cache থেকে।
   Supabase API কখনো cache হবে না। */

const CACHE = "krishi-kendra-v2";   // নতুন version দিতে চাইলে এই নাম বদলাও

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* Supabase ও অন্য API সরাসরি network-এ যাবে */
  if (url.hostname.endsWith("supabase.co") || url.hostname.endsWith("supabase.in")) return;

  event.respondWith(
    fetch(req, { cache: "no-store" })
      .then(res => {
        if (res && res.ok && (url.origin === location.origin || url.hostname === "cdn.jsdelivr.net")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
