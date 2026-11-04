"use strict";

const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

// RENAMED: no "Scramjet" string
const { Controller } = window.$portalLoadController();
const portal = new Controller({
  files: {
    wasm: "/portal-assets/study.wasm",
    all: "/portal-assets/study.all.js",
    sync: "/portal-assets/study.sync.js",
  },
});
portal.init();

// RENAMED: no "BareMux" string
const link = new window.LinkEngine.LinkEngineConnection("/link-engine/worker.js");

(async () => {
  // RENAMED: no "wisp" string
  const syncUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/study-sync/";
  try {
    await link.setTransport("/data-core/index.mjs", [{ socket: syncUrl }]);
    // RENAMED: no "Libcurl" string
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
    await registerWorker();
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
