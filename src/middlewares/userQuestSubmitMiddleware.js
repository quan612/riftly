import whitelistUserMiddleware from './whitelistUserMiddleware'
import { QuestDuration } from '@prisma/client'
import moment from 'moment'
import { prisma } from '@context/PrismaContext'

/** This middle apply to all quest to check for state*/

/** Rate limit here */
const userQuestSubmitMiddleware = (handler) => {
  return async (req, res) => {

    const { questId } = req.body
    const { userId } = req.whiteListUser; //got from whitelistUserMiddleware


    if (!questId) {
      return res.status(200).json({
        isError: true,
        message: 'Invalid quest',
      })
    }

    let currentQuest = await prisma.quest.findUnique({
      where: {
        questId,
      },
      include: {
        type: true,
      },
    })

    /* Check for time limit, enabled, disabled, deleted, hidden */
    if (currentQuest.isEnabled === false || currentQuest.isDeleted) {
      return res.status(200).json({
        isError: true,
        message: 'Quest is disabled',
      })
    }

    if (currentQuest.duration === QuestDuration.LIMITED) {

      const startDate = currentQuest?.extendedQuestData?.startDate;
      const endDate = currentQuest?.extendedQuestData?.endDate;
      const todayISO = new Date().toISOString()

      if (startDate) {
        const startDateISO = moment.utc(new Date(startDate).toISOString())
        const startDateDiff = moment.utc(todayISO).diff(
          startDateISO,
          'days',
          false,
        )
        if (startDateDiff < 0) {
          return res.status(200).json({
            isError: true,
            message: 'Too early to start quest',
          })
        }
      }

      if (endDate) {
        const endDateISO = moment.utc(new Date(endDate).toISOString())
        const endDateDiff = moment.utc(todayISO).diff(
          endDateISO,
          'days',
          false,
        )
        if (endDateDiff < 0) {
          return res.status(200).json({
            isError: true,
            message: 'Too late to start quest',
          })
        }
      }
    }

    req.currentQuest = currentQuest
    return handler(req, res)
  }
}

export default userQuestSubmitMiddleware
