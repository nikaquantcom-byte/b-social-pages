/*
 * B-Social Service Worker — SELF-DESTRUCT
 * This SW exists only to unregister itself and clear all caches.
 * It replaces the old caching SW that caused stale page issues.
 */

// On install, skip waiting so we activate immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// On activate, clear all caches and unregister
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          console.log('[SW Self-Destruct] Deleting cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('[SW Self-Destruct] All caches cleared. Unregistering...');
      return self.registration.unregister();
    }).then(() => {
      // Notify all clients to reload for clean state
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_DESTROYED' });
      });
    })
  );
});

// Don't intercept any fetches — let everything pass through to network
self.addEventListener('fetch', () => {
  // No-op: do not call event.respondWith()
  // This lets the browser handle all requests normally
});
