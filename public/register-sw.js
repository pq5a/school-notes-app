"use strict";
const stockSW = "./sw.js";

const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
	if (!navigator.serviceWorker) {
		if (
			location.protocol !== "https:" &&
			!swAllowedHostnames.includes(location.hostname)
		)
			throw new Error("Service workers cannot be registered without https.");

		throw new Error("Your browser doesn't support service workers.");
	}

	await navigator.serviceWorker.register(stockSW);

	// Wait for the SW to be ready
	await navigator.serviceWorker.ready;

	// Wire up BareMux using the Libcurl transport
	if (typeof BareMux !== "undefined") {
		const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
		
		// Use Libcurl for heavy game assets and WebGL
		await connection.setTransport("/libcurl/index.mjs", [
			{ wisp: "wss://" + location.host + "/wisp/" }
		]);
	}
}

// Expose globally so index.js can call it
window.registerSW = registerSW;
