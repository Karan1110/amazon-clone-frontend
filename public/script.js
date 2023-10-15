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

        sendPushNotification()
      })
      .catch((error) => {
        console.error(error)
      })
  })
}

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo" // Replace with your actual public VAPID key

// Function to send push notifications
async function sendPushNotification() {
  if (!serviceWorkerRegistration) {
    console.error("Service Worker registration not available.")
    return
  }

  try {
    // Register Push
    console.log("Registering Push...")
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    console.log("Push Registered...")

    // Send Push Notification
    console.log("Sending Push...")
    await fetch("http://localhost:3900/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    })
    console.log("Push Sent...")
  } catch (error) {
    console.error("Error sending push notification:", error)
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
