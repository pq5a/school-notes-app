importScripts("/uv/uv.bundle.js");
importScripts("/uv-config.js");
importScripts("/uv/uv.sw.js");

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    
    // Bypass Service Worker for core files
    if (
        url.pathname.startsWith("/bare/") ||
        url.pathname.startsWith("/bare-mux/") ||
        url.pathname.startsWith("/uv/") ||
        url.pathname === "/sw.js" ||
        url.pathname === "/uv-config.js" ||
        url.pathname === "/index.html" ||
        url.pathname === "/"
    ) {
        return;
    }
    
    event.respondWith(sw.fetch(event));
});
