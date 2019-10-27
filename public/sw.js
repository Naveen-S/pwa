self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing service worker! ', e);
})

self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activating service worker! ', e);
    return self.clients.claim();
})

self.addEventListener('fetch', (e) => {
    console.log('[Service Worker] Listening to fetch event!', e)
})