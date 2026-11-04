import { BareMuxConnection } from "/baremux/index.js";

const connection = new BareMuxConnection("/baremux/worker.js");

async function registerSW() {
    if (!navigator.serviceWorker) {
        throw new Error("Your browser doesn't support service workers.");
    }

    await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
    });

    // Swap back to the Epoxy transport for better YouTube compatibility
    await connection.setTransport("/epoxy/index.mjs", [
        { websocket: "wss://" + location.host + "/wisp/" }
    ]);

    await navigator.serviceWorker.ready;
}

registerSW().catch((err) => {
    console.error("Failed to register service worker:", err);
});
