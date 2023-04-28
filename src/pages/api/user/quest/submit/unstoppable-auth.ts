import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { updateUserUnstoppabbleTransaction } from 'repositories/transactions'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'
import { fivePerMinuteRateLimit } from '@middlewares/applyRateLimit'
import withExceptionFilter from '@middlewares/withExceptionFilter'

const { default: Resolution } = require('@unstoppabledomains/resolution')

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { UserQuest } from 'models/user-quest'

const submitUnstoppableAuthQuest = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ isError: true, message: 'Only POST' })
  }
  const {userId} = req.whiteListUser
  const { questId, uauthUser } = req.body
  const currentQuest = req.currentQuest
  let userQuest

  // checking validity of uauthUser
  const resolution = new Resolution()
  const walletOwner = await resolution.owner(uauthUser)

  if (!uauthUser) {
    throw new Error('Missing unstoppable domain account.')
  }
  if (currentQuest.type.name !== Enums.UNSTOPPABLE_AUTH) {
    throw new Error('Wrong route')
  }
  const currentUserQuest: UserQuest = await prisma.userQuest.findUnique({
    where: {
      userId_questId: { userId, questId },
    },
  })
  if (currentUserQuest) {
    throw new Error('This quest has been submitted before')
  }

  const existingUnstoppableUser = await prisma.whiteList.findFirst({
    where: {
      uathUser: uauthUser,
    },
  })

  if (existingUnstoppableUser) {
    throw new Error('Same unstoppable domain authenticated')
  }

  await fivePerMinuteRateLimit(req, res)

  const entry = await prisma.userQuest.findUnique({
    where: {
      userId_questId: { userId: userId, questId },
    },
  })

  if (entry) {
    throw new Error('This quest already submitted before')
  }

  await updateUserUnstoppabbleTransaction(questId, userId, uauthUser)
  res.status(200).json(userQuest)
}

export default withExceptionFilter(
  whitelistUserMiddleware(userQuestSubmitMiddleware(submitUnstoppableAuthQuest)),
)
