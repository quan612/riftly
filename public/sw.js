self.addEventListener("install", async function (event) {
  try {


    console.log("event in the Service Worker 🤙");
    console.log(event)
    console.log("Hello world from the Service Worker 🤙");

    // let timeout = setTimeout(function () {

    //   // const notification = new Notification("To do list", {
    //   //   body: "Hey its gooddddd",
    //   // });
    //   console.log("going to show")
    //   self.registration.showNotification("Vibration Sample", {
    //     body: "Buzz! Buzz!",
    //     // icon: "../images/touch/chrome-touch-icon-192x192.png",
    //     vibrate: [200, 100, 200, 100, 200, 100, 200],
    //     tag: "vibration-sample",
    //   })
    //   console.log("show notification")
    //   clearTimeout(timeout);
    // }, 3000)'

    // const subscribeOptions = {
    //   userVisibleOnly: true,
    //   applicationServerKey: urlBase64ToUint8Array(
    //     "BHVgKdVS-qTStVoxSfoJXjq7jkih61cy3FGFA4IHqM_vh4xWUbgzJKq2fFrcwdssflAqxaYWzleTFzWiLdbkBz8"
    //   ),
    // };
    // const subscription = await self.registration.pushManager.subscribe(subscribeOptions);
    // console.log("subscription", subscription)
    // // const response = await saveSubscription(subscription);
    // console.log(response)
    // subscript push manager, then save to database
  } catch (error) {
    console.log(error)
  }
});

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
self.addEventListener("push", function (event) {
  self.registration.getNotifications()
  console.log(event)
  self.registration.showNotification("sdkjskkjdskd");
  if (event.data) {
    console.log("Push event happen!! ", event.data.text());
  } else {
    console.log("Push event but no data");
  }

  event.waitUntil(
    self.registration.showNotification("sdkjskkjdskd", {
      // body: body,
      // icon: icon,
      // tag: tag,
      // data: data
    })
  );
});