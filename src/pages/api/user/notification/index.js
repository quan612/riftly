import whitelistUserMiddleware from '@middlewares/whitelistUserMiddleware'
import { prisma } from '@context/PrismaContext'

async function notificationUserHandler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        res.status(200).json({ message: 'ok' })
      } catch (err) {
        console.log(err)
        res.status(500).json({ isError: true, message: err.message })
      }
      break
    case 'POST':
      try {
        let userId = req.whiteListUser.userId
        await prisma.WhiteListUserData.upsert({
          where: { userId },

          create: {
            userId,
            lastNotified: new Date().toISOString(),
          },
          update: {
            lastNotified: new Date().toISOString(),
          },
        })

        res.status(200).json({ message: 'ok' })
      } catch (err) {
        console.log(err)
        res.status(500).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(notificationUserHandler)
