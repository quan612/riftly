import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import {
  submitUserQuestTransaction,
  submitUserDailyQuestTransaction,
} from 'repositories/transactions'

const submitIndividualQuestAPI = async (req, res) => {
  const { method } = req
  const { userId } = req.whiteListUser
  const { questId } = req.body

  let extendedUserQuestData = {};
  let userQuest;
  switch (method) {
    case 'POST':

      try {
        let currentQuest = await prisma.quest.findUnique({
          where: {
            questId,
          },
          include: {
            type: true,
          },
        })

        const { type } = currentQuest

        let currentUserQuest = await prisma.UserQuest.findUnique({
          where: {
            userId_questId: { userId, questId },
          },
        })
        switch (type.name) {
          case Enums.JOIN_DISCORD:
          case Enums.TWITTER_RETWEET:
          case Enums.FOLLOW_TWITTER:
          case Enums.FOLLOW_INSTAGRAM:
            if (currentUserQuest) {
              let error = 'This quest has been submitted before'
              console.log(error)
              return res.status(200).json({
                isError: true,
                message: error,
              })
            }

            userQuest = await submitUserQuestTransaction(questId, userId)

            break
          case Enums.DAILY_SHELL:
            console.log(`**Submit Daily quest**`)
            if (currentUserQuest) {
              let lastStarted =
                currentUserQuest.extendedUserQuestData?.lastStarted || currentUserQuest.createdAt
              let [today] = new Date().toISOString().split('T')
              if (today <= lastStarted) {
                return res.status(200).json({
                  isError: true,
                  message: "This quest already started today! Let's claim.",
                })
              }

              extendedUserQuestData = { ...currentUserQuest.extendedUserQuestData }
            } else {
              extendedUserQuestData = { ...currentQuest.extendedQuestData }
            }

            if (extendedUserQuestData?.frequently === 'daily') {
              const [currentDay] = new Date().toISOString().split('T')
              extendedUserQuestData.lastStarted = currentDay
            }

            userQuest = await submitUserDailyQuestTransaction(
              questId,
              extendedUserQuestData,
              userId,
            )
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
      res.setHeader('Allow', ['PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(submitIndividualQuestAPI)
