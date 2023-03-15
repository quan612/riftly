import { prisma } from '@context/PrismaContext'
import Enums from '@enums/index'

// PUT RATE LIMIT HERE
export default async function removeWebPushSubscriptionHandler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { payload } = req.body

        console.log('remove subscription to db')
        const {
          endpoint,
          keys: { auth, p256dh },
        } = payload

        let existing = await prisma.WebPushSubscription.findFirst({
          where: {
            endpoint,
          },
        })

        if (existing) {
          await prisma.WebPushSubscription.delete({
            where: {
              id: existing.id,
            },
          })
        }

        res.status(200).json({ message: 'Unsubscribe succeed.' })
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
