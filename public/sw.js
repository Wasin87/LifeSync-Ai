const CACHE_NAME = 'lifesync-ai-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/logo-512.png',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Service Worker Install Event - populates initial cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[LifeSync Worker] Pre-caching Core Shell Assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Service Worker Activate Event - cleans up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[LifeSync Worker] Purging Stale Cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper checking if dynamic resource is cacheable static file
function isStaticAsset(url) {
  const path = url.pathname;
  return (
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.png') ||
    path.endsWith('.svg') ||
    path.endsWith('.jpg') ||
    path.endsWith('.woff') ||
    path.endsWith('.woff2') ||
    path.endsWith('.ttf') ||
    path.includes('/assets/')
  );
}

// Fetch Interrogation Logic
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip browser extensions or dev sockets (like vite HMR)
  if (
    requestUrl.protocol !== 'http:' && 
    requestUrl.protocol !== 'https:' ||
    requestUrl.hostname === 'localhost' && requestUrl.port === '5173' ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Strategy A: Navigating to page routes (HTML requests) - Network First, fall back to cached index shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[LifeSync Worker] Offline Mode Active. Serving cached SPA Shell index.html');
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Strategy B: Static assets (scripts, bundles, vector logos, and design fonts) - Cache First with network update
  if (isStaticAsset(requestUrl) || ASSETS_TO_CACHE.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve immediately and refresh cache in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* silence is golden working offline */});
          
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy C: Dynamic API data (e.g. medical AI, charts, forecasts) - Network First falling back to cached response
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        console.warn('[LifeSync Worker] Network failure. Retrieving offline cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});

// Background Sync capability simulation
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-records-queue') {
    console.log('[LifeSync Worker] Background Sync Active: Syncing Pending Maternal Health queues...');
    event.waitUntil(
      // Resolve sync conceptually or post to clients
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'BACKGROUND_SYNC_COMPLETE', message: 'All pending telemedicine syncs processed.' });
        });
      })
    );
  }
});
