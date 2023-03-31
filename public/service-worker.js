self.addEventListener('push', function (event) {
  const { title, body, data } = event.data?.json() ?? {}

  const options = {
    body,
    data,
  }

  event.waitUntil(
    self.registration.showNotification(title || 'Bench Promo', options),
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
