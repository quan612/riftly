import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'

import {
  claimUserQuestTransaction,
  claimUserDailyQuestTransaction,
} from 'repositories/transactions'
import moment from 'moment'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'

const claimIndividualQuestAPI = async (req, res) => {
  const { method } = req
  const { userId } = req.whiteListUser
  const { questId } = req.body

  let userQuest
  switch (method) {
    case 'POST':

      try {
        // query the type based on questId
        let currentQuest = await prisma.quest.findUnique({
          where: {
            questId,
          },
          include: {
            type: true,
          },
        })

        const { type, rewardTypeId, quantity } = currentQuest

        // if (
        //     // type.name === Enums.IMAGE_UPLOAD_QUEST ||
        //     // type.name === Enums.CODE_QUEST ||
        //     // type.name === Enums.OWNING_NFT_CLAIM ||
        //     type.name === Enums.UNSTOPPABLE_AUTH
        // ) {
        //     return res.status(200).json({
        //         isError: true,
        //         message: "This route is only for general quest!",
        //     });
        // }

        let currentUserQuest = await prisma.UserQuest.findUnique({
          where: {
            userId_questId: { userId, questId },
          },
        })

        if (type.name === Enums.DAILY_SHELL) {

          let extendedUserQuestData = {}
          // let [today] = new Date().toISOString().split('T')
          let today = moment.utc(new Date().toISOString()).format("yyyy-MM-DD")
          if (currentUserQuest) {
            let lastClaimed = moment.utc(currentUserQuest.extendedUserQuestData?.lastClaimed).format("yyyy-MM-DD")

            if (today <= lastClaimed) {
              return res.status(200).json({
                isError: true,
                message: 'This quest already claimed today! Wait until next day',
              })
            }

            extendedUserQuestData = { ...currentUserQuest.extendedUserQuestData }
            // let yesterday = moment.utc().subtract(1, 'day').toDate();
            let diff = moment.utc(today).diff(
              lastClaimed,
              'days',
              true,
            )
            console.log(today)
            console.log(lastClaimed)
            console.log("diffffffffffffffff", diff)
            if (!lastClaimed || diff > 1) {
              //reset in_a_row
              extendedUserQuestData.in_a_row = 1
            } else {
              extendedUserQuestData.in_a_row++
            }
            extendedUserQuestData.count++

          } else {
            //first time claim daily
            extendedUserQuestData = { ...currentQuest.extendedUserQuestData }
            extendedUserQuestData.in_a_row = 1;
            extendedUserQuestData.count = 1;
          }

          /***** */
          console.log(today)
          extendedUserQuestData.lastClaimed = today

          userQuest = await claimUserDailyQuestTransaction(
            questId,
            rewardTypeId,
            quantity,
            extendedUserQuestData,
            userId,
          )
        } else {
          console.log('currentUserQuest.hasClaimed', currentUserQuest.hasClaimed)
          if (currentUserQuest.hasClaimed) {
            let error = 'This quest has been claimed before.'
            console.log(error)
            return res.status(200).json({
              isError: true,
              message: error,
            })
          }
          if (!currentUserQuest.isClaimable) {
            let error = 'This quest cannot be claimed yet.'
            console.log(error)
            return res.status(200).json({
              isError: true,
              message: error,
            })
          }
          userQuest = await claimUserQuestTransaction(questId, rewardTypeId, quantity, userId)
        }
        if (!userQuest) {
          return res.status(200).json({
            isError: true,
            message: 'User Quest cannot be submitted!',
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

// export default whitelistUserMiddleware(claimIndividualQuestAPI)
export default whitelistUserMiddleware(userQuestSubmitMiddleware(claimIndividualQuestAPI))