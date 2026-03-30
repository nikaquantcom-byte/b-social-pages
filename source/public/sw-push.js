/* ═══════════════════════════════════════════
   B-Social Push Notification Service Worker
   Only handles push — no caching, no fetch interception
   ═══════════════════════════════════════════ */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'B-Social', body: event.data.text() };
  }

  const title = data.title || 'B-Social';
  const options = {
    body: data.body || 'Du har en ny besked',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    tag: data.tag || 'b-social-message',
    data: {
      url: data.url || '/beskeder',
      conversationId: data.conversationId,
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Åbn' },
      { action: 'dismiss', title: 'Luk' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click on notification → open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/beskeder';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If app is already open, focus it and navigate
      for (const client of clients) {
        if (client.url.includes('b-social.net')) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});
