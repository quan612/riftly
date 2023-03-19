import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import {
  submitUserQuestTransaction,
  submitUserDailyQuestTransaction,
} from 'repositories/transactions'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'

const submitIndividualQuestAPI = async (req, res) => {
  const { method } = req
  const { userId } = req.whiteListUser
  const { questId } = req.body
  const currentQuest = req.currentQuest

  // let extendedUserQuestData = {};
  let userQuest;
  switch (method) {
    case 'POST':

      try {
        const { type } = currentQuest

        let currentUserQuest = await prisma.UserQuest.findUnique({
          where: {
            userId_questId: { userId, questId },
          },
        })
        if (currentUserQuest) {
          let error = 'This quest has been submitted before'
          console.log(error)
          return res.status(200).json({
            isError: true,
            message: error,
          })
        }

        switch (type.name) {
          case Enums.JOIN_DISCORD:
          case Enums.TWITTER_RETWEET:
          case Enums.FOLLOW_TWITTER:
          case Enums.FOLLOW_INSTAGRAM:
            userQuest = await submitUserQuestTransaction(questId, userId)
            break
          default:
            return res.status(200).json({ isError: true, message: 'Unsupported quest type submit' })
        }

        if (!userQuest) {
          return res.status(200).json({
            isError: true,
            message: 'User quest cannot be submitted!',
          })
        }

        return res.status(200).json(userQuest)
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message, questId })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// export default whitelistUserMiddleware(submitIndividualQuestAPI)
export default whitelistUserMiddleware(userQuestSubmitMiddleware(submitIndividualQuestAPI))
