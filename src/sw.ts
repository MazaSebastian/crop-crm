// Minimal SW: cache estático básico y fallback de navegación
// Tipado laxo para el contexto de Service Worker
declare const self: any;
const CACHE = 'chakra-cache-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Activa inmediatamente la nueva versión
  // @ts-ignore
  self.skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  // Toma control de las páginas abiertas
  // @ts-ignore
  self.clients?.claim();
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


// Push notifications: mostrar y manejar clicks
self.addEventListener('push', (event: any) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Chakra';
    const options: any = {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {}
});

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr: any[]) => {
      for (const client of clientsArr) {
        try {
          if ('focus' in client) {
            client.focus();
            if (client.navigate) client.navigate(url);
            return;
          }
        } catch {}
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

// Marcar como módulo para TS (--isolatedModules); será eliminado en el build del SW
export {};
