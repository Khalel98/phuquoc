const CACHE_NAME = "phuquoc-trip-v4";

function asset(path) {
  return new URL(path, self.location).href;
}

const PRECACHE = [
  "index.html",
  "more.html",
  "app.js",
  "icons.svg",
  "css/fonts.css",
  "fonts/rubik-latin.woff2",
  "fonts/rubik-latin-ext.woff2",
  "fonts/rubik-cyrillic.woff2",
  "documents.html",
  "docs/ticket-khalel.pdf",
  "docs/ticket-akyn.pdf",
  "docs/voucher-hotel.pdf",
  "docs/insurance-khalel.pdf",
  "docs/insurance-akyn.pdf",
  "docs/passport-khalel.pdf",
  "docs/memo-vietnam.pdf",
  "docs/payment-tour-1.pdf",
  "docs/payment-tour-2.pdf",
  "docs/transfer-akyn.pdf",
  "razgovornik.html",
  "converter.html",
  "pogoda.html",
  "music.html",
  "challenge.html",
  "css/common.css",
  "places-info.js",
  "places-images.js",
  "place-routes.js",
  "site-audio.js",
  "music-data.js",
  "music-page.js",
  "challenge-data.js",
  "challenge-page.js",
  "phrasebook.js",
  "register-sw.js",
  "audio/places/an_thoi_islands.mp3",
  "audio/places/duong_dong_night.mp3",
  "audio/places/east_coast.mp3",
  "audio/places/phuquoc_island.mp3",
  "audio/places/south_cable_car.mp3",
  "places/an-thoi-islands.jpg",
  "places/banh-mi.jpg",
  "places/cable-car.jpg",
  "places/crab-dish.jpg",
  "places/dinh-cau.jpg",
  "places/duong-dong-market.jpg",
  "places/fireworks.jpg",
  "places/fish-sauce.jpg",
  "places/fishing-boats.jpg",
  "places/grand-world.jpg",
  "places/ham-ninh.jpg",
  "places/ho-quoc-pagoda.jpg",
  "places/hon-thom.jpg",
  "places/hotel.jpg",
  "places/kiss-bridge.jpg",
  "places/long-beach.jpg",
  "places/massage-spa.jpg",
  "places/night-market.jpg",
  "places/palm-beach.jpg",
  "places/pepper-farm.jpg",
  "places/pho-bowl.jpg",
  "places/pqc-airport.jpg",
  "places/prison.jpg",
  "places/resort-pool.jpg",
  "places/restaurant-vn.jpg",
  "places/safari.jpg",
  "places/sao-beach.jpg",
  "places/seafood-grill.jpg",
  "places/snorkeling.jpg",
  "places/starfish.jpg",
  "places/sunset-beach.jpg",
  "places/sunset-town.jpg",
  "places/vinwonders.jpg",
  "places/vn-coffee.jpg",
  "places/water-park.jpg",
  "places/palm-beach.jpg",
].map(asset);

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return Promise.all(
          PRECACHE.map(function (url) {
            return cache.add(url).catch(function () {
              return null;
            });
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE_NAME;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (response && response.status === 200) {
          const ct = response.headers.get("content-type") || "";
          if (
            ct.includes("text/html") ||
            ct.includes("javascript") ||
            ct.includes("text/css") ||
            ct.includes("image/") ||
            ct.includes("audio/") ||
            ct.includes("application/pdf") ||
            ct.includes("font") ||
            ct.includes("svg")
          ) {
            try {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, copy);
              });
            } catch (e) {
              /* ignore */
            }
          }
        }
        return response;
      })
      .catch(function () {
        return caches.match(event.request).then(function (hit) {
          if (hit) return hit;
          if (event.request.mode === "navigate") {
            return caches.match(asset("index.html"));
          }
          return Promise.reject(new Error("offline"));
        });
      })
  );
});
