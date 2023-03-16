import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { updateUserUnstoppabbleTransaction } from 'repositories/transactions'

const { default: Resolution } = require('@unstoppabledomains/resolution')

const submitUnstoppableAuthQuest = async (req, res) => {
  const { method } = req
  const whiteListUser = req.whiteListUser
  const { questId, uauthUser } = req.body
  let userQuest

  switch (method) {
    case 'POST':

      try {
        if (!uauthUser) {
          return res.status(200).json({
            isError: true,
            message: 'Missing unstoppable domain account!',
          })
        }

        // query the type based on questId
        let currentQuest = await prisma.quest.findUnique({
          where: {
            questId,
          },
          include: {
            type: true,
          },
        })

        if (!currentQuest) {
          return res.status(200).json({
            isError: true,
            message: 'This quest not existed!',
          })
        }

        if (currentQuest.type.name !== Enums.UNSTOPPABLE_AUTH) {
          return res.status(200).json({
            isError: true,
            message: 'This route is for unstoppable quest!',
          })
        }

        const { questId } = currentQuest
        // TODO: Manual check kind of quest, if Limited then check quest data to see whether it expired, maybe in a middleware

        let entry = await prisma.UserQuest.findUnique({
          where: {
            userId_questId: { userId: whiteListUser.userId, questId },
          },
        })

        if (entry) {
          return res.status(200).json({
            isError: true,
            message: 'This quest already submitted before!',
          })
        }

        let existingUnstoppableUser = await prisma.whiteList.findFirst({
          where: {
            uathUser: uauthUser,
          },
        })

        if (existingUnstoppableUser) {
          let error = 'Same unstoppable domain authenticated!'
          return res.status(200).json({
            isError: true,
            message: error,
          })
        }

        // checking validity of uauthUser
        const resolution = new Resolution()
        let walletOwner = await resolution.owner(uauthUser)

        await updateUserUnstoppabbleTransaction(questId, whiteListUser?.userId, uauthUser)
        return res.status(200).json(userQuest)
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message, questId })
      }
      break
    default:
      res.setHeader('Allow', ['PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// This only allows for login user
export default whitelistUserMiddleware(submitUnstoppableAuthQuest)
