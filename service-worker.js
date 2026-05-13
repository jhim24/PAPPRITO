const CACHE_NAME = "papprito-cache-v20";

const urlsToCache = [
  "/",
  "/index.html",
  "/menu.html",
  "/gallery.html",
  "/branches.html",
  "/comments.html"
];

/* INSTALL */
self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

});

/* ACTIVATE */
self.addEventListener("activate", event => {

  clients.claim();

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    })

  );

});

/* FETCH - NETWORK FIRST */
self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const responseClone =
        response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {

            cache.put(
              event.request,
              responseClone
            );

          });

        return response;

      })

      .catch(() => {

        return caches.match(
          event.request
        );

      })

  );

});
