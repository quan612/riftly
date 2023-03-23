import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { submitUserQuestTransaction } from 'repositories/transactions'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'
import withExceptionFilter from '@middlewares/withExceptionFilter'

const submitIndividualQuestAPI = async (req, res) => {
  const { method } = req
  const { userId } = req.whiteListUser
  const { questId } = req.body
  const currentQuest = req.currentQuest

  // let extendedUserQuestData = {};
  let userQuest
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
          throw new Error('This quest has been submitted before')
        }

        switch (type.name) {
          case Enums.JOIN_DISCORD:
          case Enums.TWITTER_RETWEET:
          case Enums.FOLLOW_TWITTER:
          case Enums.FOLLOW_INSTAGRAM:
          case Enums.LIMITED_FREE_SHELL:
            userQuest = await submitUserQuestTransaction(questId, userId)
            break
          default:
            throw new Error('Unsupported quest type submit')
        }

        if (!userQuest) {
          throw new Error('User quest cannot be submitted')
        }

        res.status(200).json(userQuest)
      } catch (error) {
        console.log(error)
        throw error
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// export default whitelistUserMiddleware(submitIndividualQuestAPI)
export default withExceptionFilter(
  whitelistUserMiddleware(userQuestSubmitMiddleware(submitIndividualQuestAPI)),
)
