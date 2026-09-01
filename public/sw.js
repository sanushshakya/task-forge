// public/sw.js

/**
 * A minimal cache-first service worker for a web application.
 *
 * This service worker will cache static assets and respond to fetch requests
 * with cached responses when available. It ensures that the latest version of
 * the app shell is served after an update, while serving cached content otherwise.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/index.html',
        '/styles.css',
        '/script.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});