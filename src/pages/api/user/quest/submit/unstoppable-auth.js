import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { updateUserUnstoppabbleTransaction } from 'repositories/transactions'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'
import { fivePerMinuteRateLimit } from '@middlewares/applyRateLimit'
import withExceptionFilter from '@middlewares/withExceptionFilter'

const { default: Resolution } = require('@unstoppabledomains/resolution')

const submitUnstoppableAuthQuest = async (req, res) => {
  const { method } = req
  const whiteListUser = req.whiteListUser
  const { questId, uauthUser } = req.body
  const currentQuest = req.currentQuest
  let userQuest

  // checking validity of uauthUser
  const resolution = new Resolution()
  let walletOwner = await resolution.owner(uauthUser)

  if (method !== "POST") {
    throw new Error('Only for post request')
  }

  if (!uauthUser) {
    throw new Error('Missing unstoppable domain account.')
  }
  if (currentQuest.type.name !== Enums.UNSTOPPABLE_AUTH) {
    throw new Error('Wrong route')
  }

  let existingUnstoppableUser = await prisma.whiteList.findFirst({
    where: {
      uathUser: uauthUser,
    },
  })

  if (existingUnstoppableUser) {
    throw new Error('Same unstoppable domain authenticated')
  }

  await fivePerMinuteRateLimit(req, res)

  let entry = await prisma.UserQuest.findUnique({
    where: {
      userId_questId: { userId: whiteListUser.userId, questId },
    },
  })

  if (entry) {
    throw new Error('This quest already submitted before')
  }


  await updateUserUnstoppabbleTransaction(questId, whiteListUser?.userId, uauthUser)

  res.status(200).json(userQuest)
}

export default withExceptionFilter(
  whitelistUserMiddleware(userQuestSubmitMiddleware(submitUnstoppableAuthQuest)),
)
