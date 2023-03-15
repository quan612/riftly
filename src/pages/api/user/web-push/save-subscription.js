import { utils } from 'ethers'
import { prisma } from '@context/PrismaContext'
import Enums from '@enums/index'

const bcrypt = require('bcrypt')

// PUT RATE LIMIT HERE, mostly track IP that post to this api, block if more than 5
export default async function webPushSubscriptionHandler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { pushSubscription } = req.body
        // saving subscriptions to db
        console.log('save new subscription to db')
        const {
          endpoint,
          keys: { auth, p256dh },
        } = pushSubscription
        let newSubscription = await prisma.WebPushSubscription.create({
          data: {
            endpoint,
            auth,
            p256dh,
          },
        })
        return res.status(200).json({ message: 'Subscription succeed.', newSubscription })
      } catch (error) {
        console.log(error)
        return res.status(200).json({ isError: true, message: error.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
