// console.log('Started', self);
self.addEventListener('install', function (event) {
  console.log('sw install')
  try {
    self.skipWaiting()
    console.log('Service Worker installed 🤙')
  } catch (error) {
    console.log(error)
  }
})

// self.addEventListener('activate', function (event) {
//   console.log('Activated', event);
// });

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

self.addEventListener(
  'notificationclick',
  function (event) {
    switch (event.action) {
      case 'open_riftly_url':
        clients.openWindow(event.notification.data.url) //which we got from above
        break
      case 'any_other_action':
        clients.openWindow('https://riftly.vercel.app')
        break
    }
  },
  false,
)

self.addEventListener('push', async function (event) {
  console.log('Push event happen!! ', event.data.text())
  if (event.data) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting()
    }
    try {
      let buf = event.data.text()
      let payload = JSON.parse(buf)
      const { text, description, action, tag } = payload
      event.waitUntil(
        self.registration.showNotification('A new quest from Riftly', {
          body: text,

          // tag,
          image: 'https://riftly.vercel.app/img/user/banner.png',
          icon: '/images/user/Logo_mark.svg',
          // data: data
          data: { url: 'https://riftly.vercel.app' }, //the url which we gonna use later
          actions: [{ action, title: 'Check now' }],
        }),
      )
      self.skipWaiting()
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Push event but no data')
  }
})

self.addEventListener('pushsubscriptionchange', function (event) {
  let host
  if (process.env.NODE_ENV !== 'production') {
    host = 'http://localhost:3000'
  } else {
    host = 'https://riftly.vercel.app'
  }
  let payload = {
    old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
    new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
    new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
    new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null,
  }
  event.waitUntil(
    fetch(`${host}/api/user/web-push/subscription-change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({
      //   old_endpoint: event.oldSubscription
      //     ? event.oldSubscription.endpoint
      //     : null,
      //   new_endpoint: event.newSubscription
      //     ? event.newSubscription.endpoint
      //     : null,
      //   new_p256dh: event.newSubscription
      //     ? event.newSubscription.toJSON().keys.p256dh
      //     : null,
      //   new_auth: event.newSubscription
      //     ? event.newSubscription.toJSON().keys.auth
      //     : null,
      // }),
      body: JSON.stringify(payload),
    }),
  )
})
