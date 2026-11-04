(async function() {
    try {
        if (!navigator.serviceWorker) {
            throw new Error("Your browser doesn't support service workers.");
        }

        await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
        });

        // BareMux is loaded globally in your HTML, so we check for it
        if (typeof BareMux !== "undefined") {
            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            await connection.setTransport("/epoxy/index.mjs", [
                { websocket: "wss://" + location.host + "/wisp/" }
            ]);
        }

        await navigator.serviceWorker.ready;
    } catch (err) {
        console.error("Failed to register service worker:", err);
    }
})();
