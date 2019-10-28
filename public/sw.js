self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing service worker! ', e);
    e.waitUntil(caches.open('static').then(cache => {
        console.log('[Service Worker] Pre caching...')
        cache.add('/');
        cache.add('/index.html');
        cache.add('/src/js/app.js');

    }))
})

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activating service worker! ', e);
    return self.clients.claim();
})

self.addEventListener('fetch', (e) => {
    // console.log('[Service Worker] Listening to fetch event!', e);
    
    // To not respond anything [Intercept and block fetch requests]
    // e.respondWith(null);

    // e.respondWith(fetch(e.request));
    e.respondWith(
        caches.match(e.request).then(response => {
            if(response) {
                return response;
            } else {
                return fetch(e.request);
            }
        })
    );
})