const CACHE_NAME = "papprito-cache";

/* INSTALL */
self.addEventListener("install", event => {

self.skipWaiting();

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => caches.delete(key))

);

})

);

});

/* ACTIVATE */
self.addEventListener("activate", event => {

clients.claim();

});

/* FETCH */
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
