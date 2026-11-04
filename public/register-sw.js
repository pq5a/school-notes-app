async function registerSW() {
    if (!navigator.serviceWorker) {
        throw new Error("Your browser doesn't support service workers.");
    }

    await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
    });

    // Ensure BareMux is loaded before using it
    if (typeof BareMux !== "undefined") {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        await connection.setTransport("/epoxy/index.mjs", [
            { websocket: "wss://" + location.host + "/wisp/" }
        ]);
    }

    await navigator.serviceWorker.ready;
}

// Expose it globally for index.js to call
window.registerSW = registerSW;
