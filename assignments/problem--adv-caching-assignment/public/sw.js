
var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/app.css',
          '/src/css/main.css',
          '/src/js/main.js',
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            console.log('Deleting static cache');
            return caches.delete(key);
          }
        }));
      })
  );
});

// cache first, fallback network.
/* 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function(err) {

            });
        }
      })
  );
}); */

// Network only strategy.
/* self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request)
  )}
) */ 


// Cache only strategy.
 /* self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if(response) {
        return response;
      }
    })
  )
})  */

// Network cache fallback
/* self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(err => {
      return caches.match(e.request)
      // Redundant since caches.match already return resp
      // .then(resp => {
      //   if(resp) {
      //     return resp;
      //   }
      // })
    })
  )
})  */

// Network cache fallback with dynamic caching 
/* self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
    .then(res => {
      return caches.open(CACHE_DYNAMIC_NAME)
        .then(function(cache) {
          cache.put(e.request.url, res.clone());
          return res;
      });
    })
    .catch(err => {
      return caches.match(e.request)
      // Redundant since caches.match already return resp
      // .then(resp => {
      //   if(resp) {
      //     return resp;
      //   }
      // })
    })
  )
}) */

/* 
// Cache, then network
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
    .then(res => {
      return caches.open(CACHE_DYNAMIC_NAME)
        .then(function(cache) {
          cache.put(e.request.url, res.clone());
          return res;
      });
    })
  )
}) 
*/

// Strategy based on URL

self.addEventListener('fetch', e => {
  // Cache only
  if(STATIC_ASSETS.find((asset) => asset === e.request.url)) {
    e.respondWith(
      caches.match(e.request).then(response => {
        if(response) {
          return response;
        }
      })
    )
  }
  // Cache, then network
  else if(e.request.url.indexOf('https://httpbin.org/ip') > -1) {
    e.respondWith(
      fetch(e.request)
      .then(res => {
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            cache.put(e.request.url, res.clone());
            return res;
        });
      })
    )
  } 
  // Cache, then network fallback
  else {
    e.respondWith(
      caches.match(e.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(e.request)
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(e.request.url, res.clone());
                    return res;
                  });
              })
              .catch(function(err) {
  
              });
          }
        })
    );  
  }
})