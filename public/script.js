let serviceWorkerRegistration

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", {
        scope: "./", // Adjust the scope if needed
      })
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope)
        serviceWorkerRegistration = registration // Store the registration for reuse
      })
      .catch((error) => {
        console.error(error)
      })
  })
}
