self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push received')

  const { title, body, data } = event.data?.json() ?? {}

  const options = {
    body,
    data,
  }

  event.waitUntil(
    self.registration.showNotification(title || 'Título padrão', options),
  )
})

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received')

  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
