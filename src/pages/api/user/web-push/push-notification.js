import { prisma } from '@context/PrismaContext'
import { utils } from 'ethers'
const webpush = require('web-push')

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID,
  privateKey: process.env.PRIVATE_VAPID,
}

//TODO: This should be limit as internal api, using api secret key
export default async function pushNotification(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { text, description, action, tag } = req.body
        // get all subscriptions
        console.log(123)
        let subscriptions = await prisma.WebPushSubscription.findMany()

        let payload = {
          text,
          description,
          action,
          // tag,
        }

        webpush.setVapidDetails(
          'mailto:myuserid@email.com',
          vapidKeys.publicKey,
          vapidKeys.privateKey,
        )

        let pushOp = subscriptions.map((s) => {
          let buf = Buffer.from(JSON.stringify(payload))
          let subscriptionObj = {
            endpoint: s.endpoint,
            expirationTime: null,
            keys: {
              p256dh: s.p256dh,
              auth: s.auth,
            },
          }
          webpush
            .sendNotification(subscriptionObj, buf)
            .then(function () { })
            .catch(function () {
              console.log(
                'ERROR in sending Notification, endpoint removed ' + subscriptionObj.endpoint,
              )
            })
        })

        await Promise.all(pushOp)

        res.status(200).json({ message: 'ok' })
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
