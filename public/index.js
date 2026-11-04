"use strict";

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const { Controller } = window.$scramjetLoadController();
const portal = new Controller({
  files: {
    wasm: "/portal-assets/scramjet.wasm.wasm",
    all: "/portal-assets/scramjet.all.js",
    sync: "/portal-assets/scramjet.sync.js",
  },
});
portal.init();

const link = new window.BareMux.BareMuxConnection("/link-engine/worker.js");

(async () => {
  const syncUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/study-sync/";
  try {
    await link.setTransport("/data-core/index.mjs", [{ socket: syncUrl }]);
    console.log("Core transport ready.");
  } catch (err) {
    console.error("Transport init failed:", err);
    error.textContent = "Connection failed. Please refresh.";
    errorCode.textContent = err.toString();
  }
})();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Worker registration failed.";
    errorCode.textContent = err.toString();
    throw err;
  }
  const url = search(address.value, searchEngine.value);
  const frame = portal.createFrame();
  frame.frame.id = "sj-frame";
  document.body.appendChild(frame.frame);
  frame.go(url);
});
