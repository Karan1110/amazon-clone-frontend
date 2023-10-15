const CACHE_NAME = "cache-v1"

self.addEventListener("push", (e) => {
  const data = e.data.json()
  console.log("Push Data:", data)
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  })
  console.log(data)
  console.log("Push Received...")
})

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "./index.html", "./manifest.json"])
    })
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
