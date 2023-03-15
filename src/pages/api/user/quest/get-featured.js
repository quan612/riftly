import { getAllEnableQuestsForUser, getQuestsStartedByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { QuestStyle, QuestDuration } from '@prisma/client'

const userFeatureQuestQueryHandler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.whiteListUser

        let availableQuests = await getAllEnableQuestsForUser()

        console.log(`** Get quests done by this user **`)
        let finishedQuest = await getQuestsStartedByThisUser(userId)

        let quests = availableQuests
          .filter((q) => {
            if (q.extendedQuestData.collaboration && q.extendedQuestData.collaboration.length > 0) {
              return false
            }

            if (q.hasClaimed) {
              return false
            }

            if (q.style === QuestStyle.NORMAL) {
              return false
            }

            return true
          })
          .map((aq) => {
            let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId)
            if (relatedQuest) {

              if (
                relatedQuest?.quest.type.name === Enums.DAILY_SHELL &&
                relatedQuest?.extendedUserQuestData?.frequently === Enums.DAILY
              ) {
                let lastStarted = relatedQuest?.extendedUserQuestData?.lastStarted
                let lastClaimed = relatedQuest?.extendedUserQuestData?.lastClaimed
                let [today] = new Date().toISOString().split('T')

                if (today > lastStarted || !lastStarted) {
                  aq.isClaimable = false
                } else {
                  aq.isClaimable = true
                }
                if (today > lastClaimed || !lastClaimed) {
                  aq.hasClaimed = false
                } else {
                  aq.hasClaimed = true
                }
              }

              // THE REST
              else {
                aq.isClaimable = relatedQuest.isClaimable
                aq.hasClaimed = relatedQuest.hasClaimed
                aq.rewardedQty = relatedQuest.rewardedQty
              }
            } else {
              aq.isClaimable = false
              aq.hasClaimed = false
              aq.rewardedQty = 0
            }
            if (relatedQuest?.quest.type.name === Enums.CODE_QUEST) {
              delete aq.extendedQuestData
            }

            return aq
          }).filter(q => q.hasClaimed === false)

        return res.status(200).json(quests)
      } catch (err) {
        res.status(200).json({ isError: true, message: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(userFeatureQuestQueryHandler)
