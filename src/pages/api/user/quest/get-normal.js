import { getAllEnableQuestsForUser, getQuestsStartedByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { QuestStyle, QuestDuration } from '@prisma/client'
import moment from 'moment'

const userQuestQueryHandler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.whiteListUser
        let availableQuests = await getAllEnableQuestsForUser()
        let finishedQuest = await getQuestsStartedByThisUser(userId)

        let quests = availableQuests
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
              const todayISO = new Date().toISOString()

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
            let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId)
            if (aq.type.name === Enums.DAILY_SHELL) {
              //Enums.DAILY_SHELL

              // if (relatedQuest?.extendedUserQuestData?.frequently === Enums.DAILY) {
              // let lastStarted = relatedQuest?.extendedUserQuestData?.lastStarted

              let lastClaimed = moment
                .utc(relatedQuest?.extendedUserQuestData?.lastClaimed)
                .format('yyyy-MM-DD')
              // let [today] = new Date().toISOString().split('T')
              let today = moment.utc(new Date().toISOString()).format('yyyy-MM-DD')
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
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(userQuestQueryHandler)
