// Minimal SW: cache estático básico y fallback de navegación
const CACHE = 'chakra-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event: any) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Network-first para HTML (navegación), cache-first para estáticos
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
  } else {
    event.respondWith(
      caches.match(req).then(res => res || fetch(req))
    );
  }
});


