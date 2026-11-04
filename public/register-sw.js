// public/register-sw.js
"use strict";

const stockSW = "./study-worker.js"; // RENAMED from sw.js
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerWorker() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");
    throw new Error("Your browser doesn't support service workers.");
  }
  await navigator.serviceWorker.register(stockSW);
  await navigator.serviceWorker.ready;
}

window.registerWorker = registerWorker; // RENAMED from registerSW
