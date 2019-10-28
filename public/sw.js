var STATIC_CACHE_VERSION = 'static-v5';
var DYNAMIC_CACHE_VERSION = 'dynamic-v1';

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing service worker! ', e);
    e.waitUntil(caches.open(STATIC_CACHE_VERSION).then(cache => {
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
    // Cleaning up of Old Caches. 
    // Why here? 
    // To not to break the existing app while user is using the app. 
    // And since Activation event is triggered only once after page renders for the first time its the best place.
    
    // Get the list of keys and delete the old one. After every update to normal src files update the CACHE VERSION above.
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if(key !== STATIC_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION) {
                    console.log('[Service Worker] Removing old cache.', key);
                    return caches.delete(key);
                } else {
                    return null;
                }
            }))
        })
    );
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
                    return caches.open(DYNAMIC_CACHE_VERSION).then(cache => { 
                            // Dynamic caching
                            // cache.put(e.request.url, res.clone());
                            return res;
                    })
                }).catch(err => {
                    console.log('Handle error!');
                });
            }
        })
    );
})