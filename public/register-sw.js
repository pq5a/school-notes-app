if (navigator.serviceWorker) {
    navigator.serviceWorker.register("/sw.js", {
        scope: "/"
    }).then(() => {
        console.log("Service Worker registered successfully.");
    }).catch((err) => {
        console.error("Service Worker registration failed:", err);
    });
}
