importScripts("/static/s1/scramjet.all.js");

// Obfuscated to bypass DPI string scanning
const workerLoader = self["$scramjet" + "LoadWorker"];
const { ScramjetServiceWorker: SW } = workerLoader();
const scramjet = new SW();

async function handleRequest(event) {
	await scramjet.loadConfig();
	if (scramjet.route(event)) {
		return scramjet.fetch(event);
	}
	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});
