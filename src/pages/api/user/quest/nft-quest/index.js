import { getAllEnableQuestsForUser, getQuestsStartedByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'

const owningNftQuestQueryAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { nft } = req.query

        if (!nft || nft.length < 1) {
          return res.status(200).json({ message: 'waiting' })
        }
        const whiteListUser = req.whiteListUser


        let availableQuests = await getAllEnableQuestsForUser()


        let finishedQuest = await getQuestsStartedByThisUser(whiteListUser.userId)

        let quests = availableQuests
          .filter((q) => {
            if (q.type.name === Enums.OWNING_NFT_CLAIM && q.extendedQuestData.nft === nft) {
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
        console.log(err)
        res.status(500).json({ error: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(owningNftQuestQueryAPI)
