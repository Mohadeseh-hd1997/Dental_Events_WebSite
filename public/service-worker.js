const cachePrefix = "cache-";
const currentCacheVersion = "v3";
const cacheName = `${cachePrefix}${currentCacheVersion}`;

const staticAssets = [
    "./",
    "./index.html",
    "./favicon/favicon.ico",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(staticAssets))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith(cachePrefix) && name !== cacheName)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// self.addEventListener("fetch", event => {
//     event.respondWith(handleFetch(event.request));
// });

self.addEventListener("fetch", event => {
    event.respondWith(fetch(event.request));
});

async function handleFetch(request) {
    // Skip caching requests with "chrome-extension" scheme
    if (request.url.startsWith("chrome-extension://")) {
        return fetch(request);
    }

    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        // Serve cached response
        return cachedResponse;
    }

    // Fetch from network and update cache
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
        const clonedResponse = networkResponse.clone();
        cache.put(request, clonedResponse);
    }

    return networkResponse;
}
