importScripts("/uv/uv.bundle.js");
importScripts("/uv-config.js");
importScripts("/uv/uv.sw.js");

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    
    // DO NOT intercept core files, only proxy the actual searches
    if (
        url.pathname.startsWith("/bare/") || 
        url.pathname.startsWith("/bare-mux/") || 
        url.pathname.startsWith("/uv/") ||
        url.pathname === "/sw.js" ||
        url.pathname === "/uv-config.js"
    ) {
        return; // Let the browser fetch these directly
    }
    
    // Intercept search requests
    event.respondWith(sw.fetch(event));
});
