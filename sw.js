const V = 'iloverunn-v6';
const ASSETS = ['/hub/', '/hub/index.html', '/hub/manifest.json', '/hub/logo192.png', '/hub/logo512.png', '/hub/logo180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('docs.google.com') ||
      e.request.url.includes('fonts.googleapis.com') ||
      e.request.url.includes('framerusercontent.com')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(V).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
