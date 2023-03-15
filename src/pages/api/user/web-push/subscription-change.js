import { utils } from 'ethers'
import { prisma } from '@context/PrismaContext'

export default async function webPushSubscriptionHandler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { payload } = req.body
        console.log('SUBSCRIPTION CHANGE')
        console.log('payload', payload)
        // saving subscriptions to db
        // console.log(pushSubscription);
        // let newSubscription = await prisma.WebPushSubscription.create({
        //   data: {
        //     subscriptionObj: pushSubscription,
        //   },
        // });
        // return res
        //   .status(200)
        //   .json({ message: "Subscription succeed.", newSubscription });
        res.status(200).json({ message: 'ok' })
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
