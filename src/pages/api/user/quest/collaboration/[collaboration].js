import { getAllEnableQuestsForUser, getQuestsStartedByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

const collaborationQuestQueryAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { collaboration } = req.query
        const whiteListUser = req.whiteListUser

        let availableQuests = await getAllEnableQuestsForUser()


        let finishedQuest = await getQuestsStartedByThisUser(whiteListUser.userId)

        let quests = availableQuests
          .filter((q) => {
            if (
              // only get quest that has collaboration same as query uri
              q?.extendedQuestData?.collaboration &&
              q?.extendedQuestData?.collaboration.length > 0 &&
              q?.extendedQuestData?.collaboration === collaboration
            ) {
              return true
            }

            return false
          })
          .map((aq) => {
            let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId)
            if (relatedQuest) {
              aq.hasStarted = true
              aq.rewardedQty = relatedQuest.rewardedQty
            } else {
              aq.hasStarted = false
              aq.rewardedQty = 0
            }
            return aq
          })

        return res.status(200).json(quests)
      } catch (err) {
        res.status(200).json({ error: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(collaborationQuestQueryAPI)
