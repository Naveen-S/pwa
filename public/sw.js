self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing service worker! ', e);
    e.waitUntil(caches.open('static').then(cache => {
        console.log('[Service Worker] Pre caching...');
        // Static caching.
        cache.addAll([
            '/',
            '/index.html',
            '/src/js/app.js',
            '/src/js/feed.js',
            '/src/js/material.min.js',
            '/src/css/app.css',
            '/src/css/feed.css',
            '/src/images/main-image.jpg',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ])
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

    // If you find the request in the cache serve from cache else make a fetch request.
    // During fetch request cache the response(dynamic cache) so you can respond from cache later.
    e.respondWith(
        caches.match(e.request).then(response => {
            if(response) {
                return response;
            } else {
                return fetch(e.request).then(res => { 
                    return caches.open('dynamic').then(cache => { 
                            // Dynamic caching
                            cache.put(e.request.url, res.clone());
                            return res;
                    })
                }).catch(err => {
                    console.log('Handle error!');
                });
            }
        })
    );
})