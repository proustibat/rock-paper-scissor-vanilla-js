const cacheName = "calculator v1"; //the name of our cache
const cacheAsset = ["index.html", "css/game.css", "js/serviceworker.js", "js/app.js"]; //this is the asset that we want to cache

self.addEventListener("install", (e) => {
  console.log("service worker installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(async (cache) => {
        console.log("service worker: caching files");
        await cache.addAll(cacheAsset);
      })
      .then(() => self.skipWaiting())
  );

  self.addEventListener("activate", (e) => {
    console.log("service worker activated");

  //removing unwanted caches
    e.waitUntil(
      caches.keys().then((cacheName) => {
        return Promise.all(
          cacheName.map((cache) => {
            if (cache !== cacheName) {
              console.log("Service worker: clear old caches");
              return caches.delete(cache);
            }
          })
        );
      })
    );
  });

  // Fetch our cache asset
  self.addEventListener("fetch", (e) => {
    console.log("service worker: fetching");
    //checking if the live site is avaialble and if not, responsd with the cache site
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  });

});
