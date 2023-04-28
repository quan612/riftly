import { getAllEnableQuestsForUser, getQuestsStartedByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { QuestStyle, QuestDuration, Prisma } from '@prisma/client'
import moment from 'moment'

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { QuestQuery } from 'models/quest'
import { UserQuest } from 'models/user-quest'

const userQuestQueryHandler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.json({ isError: true, message: 'Only GET' })
  }

  try {
    const { userId } = req.whiteListUser
    const availableQuests: QuestQuery[] = await getAllEnableQuestsForUser()
    const finishedQuest: UserQuest[] = await getQuestsStartedByThisUser(userId)

    const todayISO = new Date().toISOString()

    const quests = availableQuests
      .filter((q) => {
        if (
          q?.extendedQuestData?.collaboration &&
          q?.extendedQuestData?.collaboration?.length > 0
        ) {
          return false
        }
        if (q.style === QuestStyle.FEATURED) {
          return false
        }
        if (q.duration === QuestDuration.LIMITED) {
          const startDate = q?.extendedQuestData?.startDate
          const endDate = q?.extendedQuestData?.endDate

          if (startDate) {
            const startDateISO = moment.utc(new Date(startDate).toISOString())
            const startDateDiff = moment.utc(todayISO).diff(startDateISO, 'days', false)
            if (startDateDiff < 0) {
              return false
            }
          }
          if (endDate) {
            const endDateISO = moment.utc(new Date(endDate).toISOString())
            const endDateDiff = moment.utc(todayISO).diff(endDateISO, 'days', false)
            if (endDateDiff < 0) {
              return false
            }
          }
          return false
        }
        return true
      })
      .map((aq) => {
        const relatedQuest = finishedQuest.find((q) => q.questId === aq.questId)
        if (aq.type.name === Enums.DAILY_SHELL) {
          //Enums.DAILY_SHELL

          // if (relatedQuest?.extendedUserQuestData?.frequently === Enums.DAILY) {
          // let lastStarted = relatedQuest?.extendedUserQuestData?.lastStarted

          const lastClaimed = moment
            .utc(relatedQuest?.extendedUserQuestData?.lastClaimed as Prisma.JsonObject)
            .format('yyyy-MM-DD')
          // let [today] = new Date().toISOString().split('T')
          const today = moment.utc(new Date().toISOString()).format('yyyy-MM-DD')
          aq.isClaimable = true

          console.log('today', today)
          console.log('lastClaimed', lastClaimed)
          if (today > lastClaimed || !lastClaimed) {
            aq.hasClaimed = false
          } else {
            aq.hasClaimed = true
          }
          return aq
        } else {
          // THE REST

          if (relatedQuest) {
            aq.isClaimable = relatedQuest.isClaimable
            aq.hasClaimed = relatedQuest.hasClaimed
            aq.rewardedQty = relatedQuest.rewardedQty
          } else {
            aq.isClaimable = false
            aq.hasClaimed = false
            aq.rewardedQty = 0
          }
          if (relatedQuest?.quest.type.name === Enums.CODE_QUEST) {
            //remove the answer from querying
            delete aq.extendedQuestData
          }

          return aq
        }
      })

    return res.status(200).json(quests)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }
}
export default whitelistUserMiddleware(userQuestQueryHandler)
