"use strict";

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/assets/js/core/scramjet.wasm.wasm",
		all: "/assets/js/core/scramjet.all.js",
		sync: "/assets/js/core/scramjet.sync.js",
	},
});

scramjet.init();

// Updated BareMux path
const connection = new BareMux.BareMuxConnection("/assets/js/network/worker.js");

(async () => {
	// Updated WebSocket path
	const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/api/stream/";
	try {
		// Updated Libcurl path
		await connection.setTransport("/assets/js/transport/index.mjs", [{ websocket: wispUrl }]);
		console.log("Transport initialized.");
	} catch (err) {
		console.error("Failed to initialize transport:", err);
		error.textContent = "Proxy transport failed to initialize.";
		errorCode.textContent = err.toString();
	}
})();

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	const frame = scramjet.createFrame();
	frame.frame.id = "sj-frame";
	document.body.appendChild(frame.frame);
	frame.go(url);
});
