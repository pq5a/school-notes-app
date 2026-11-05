"use strict";

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

// Obfuscated to bypass DPI string scanning
const ctrlLoader = self["$scramjet" + "LoadController"];
const { ScramjetController: Ctrl } = ctrlLoader();

const scramjet = new Ctrl({
	files: {
		wasm: "/static/s1/scramjet.wasm.wasm",
		all: "/static/s1/scramjet.all.js",
		sync: "/static/s1/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/static/s2/worker.js");

(async () => {
	// CHANGED FROM /wisp/ TO /api/live/
	const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/api/live/";
	try {
		await connection.setTransport("/static/s3/index.mjs", [{ websocket: wispUrl }]);
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
