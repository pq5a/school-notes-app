importScripts("/uv/uv.bundle.js");
importScripts("/uv-config.js");
importScripts("/uv/uv.sw.js");

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    
    // CRITICAL: Do not intercept engine files or the Bare server
    if (
        url.pathname.startsWith("/bare/") ||
        url.pathname.startsWith("/bare-mux/") ||
        url.pathname.startsWith("/uv/") ||
        url.pathname === "/sw.js" ||
        url.pathname === "/uv-config.js" ||
        url.pathname === "/index.html" ||
        url.pathname === "/"
    ) {
        return; // Let the browser fetch these normally
    }
    
    // Intercept everything else (the actual searches)
    event.respondWith(sw.fetch(event));
});
