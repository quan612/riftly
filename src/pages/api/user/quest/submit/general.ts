import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { submitUserQuestTransaction } from 'repositories/transactions'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'
import withExceptionFilter from '@middlewares/withExceptionFilter'

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { UserQuest } from 'models/user-quest'

const submitIndividualQuestAPI = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ isError: true, message: 'Only POST' })
  }

  const { userId } = req.whiteListUser
  const { questId } = req.body
  const currentQuest = req.currentQuest

  // let extendedUserQuestData = {};
  let userQuest

  try {
    const { type } = currentQuest

    const currentUserQuest: UserQuest = await prisma.userQuest.findUnique({
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
      case Enums.LIMITED_FREE_POINT:
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
}

export default withExceptionFilter(
  whitelistUserMiddleware(userQuestSubmitMiddleware(submitIndividualQuestAPI)),
)
