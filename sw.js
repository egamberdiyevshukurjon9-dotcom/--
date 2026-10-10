/* ЭкоТаълим — service worker.
   Иловани интернетсиз ҳам очиш учун асосий файлларни сақлайди.
   /api/ ва /admin ҳеч қачон кешланмайди. */
"use strict";

const CACHE = "ekotalim-v13";
const SHELL = [
  "/",
  "/privacy",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/vendor/leaflet/leaflet.js",
  "/vendor/leaflet/leaflet.css",
  "/vendor/leaflet/images/marker-icon.png",
  "/vendor/leaflet/images/marker-icon-2x.png",
  "/vendor/leaflet/images/marker-shadow.png",
  "/vendor/uz-border.json",
  "/vendor/fontawesome/css/fa.min.css",
  "/vendor/fontawesome/webfonts/fa-solid-900.woff2",
  "/vendor/fontawesome/webfonts/fa-regular-400.woff2",
  "/vendor/eko-ui.css",
  "/vendor/three/three.module.min.js",
  "/vendor/eko-lab3d.js",
  "/vendor/eko-loyiha.js",
  "/vendor/eko-onlayn.js",
  "/vendor/i18n/keys.js",
  "/vendor/i18n/ru.js",
  "/vendor/i18n/en.js",
  "/vendor/fonts/onest-cyrillic-wght-normal.woff2",
  "/vendor/fonts/onest-cyrillic-ext-wght-normal.woff2",
  "/vendor/fonts/onest-latin-wght-normal.woff2",
  "/vendor/fonts/onest-latin-ext-wght-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

/* Барча файллар сақлангач, саҳифага «интернетсиз ишлашга тайёр» деб хабар берамиз */
async function tellReady() {
  const list = await self.clients.matchAll({ type: "window" });
  list.forEach((c) => c.postMessage({ type: "eko-offline-ready", cache: CACHE }));
}

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(tellReady)
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;

  // Саҳифалар: аввал интернетдан, бўлмаса кешдан
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(url.pathname === "/" ? "/" : req, copy)); }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Бошқа файллар: аввал кешдан; рўйхатда йўқ файл интернетдан олинса, у ҳам сақланади
  e.respondWith(caches.match(req, { ignoreSearch: url.pathname.startsWith("/vendor/") }).then((r) => r || fetch(req).then((res) => {
    if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
