import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'

import {
  claimUserQuestTransaction,
  claimUserDailyQuestTransaction,
} from 'repositories/transactions'
import moment from 'moment'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { UserQuest } from 'models/user-quest'
import { Quest } from 'models/quest'

const claimIndividualQuestAPI = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  const { method } = req
  const { userId } = req.whiteListUser
  const { questId } = req.body

  let userQuest
  switch (method) {
    case 'POST':

      try {
        // query the type based on questId
        const currentQuest: Quest = await prisma.quest.findUnique({
          where: {
            questId,
          },
          include: {
            type: true,
          },
        })

        const { type, rewardTypeId, quantity } = currentQuest

        const currentUserQuest: UserQuest = await prisma.userQuest.findUnique({
          where: {
            userId_questId: { userId, questId },
          },
        })

        if (type.name === Enums.DAILY_SHELL) {
          let extendedUserQuestData:any = {}
          const today = moment.utc(new Date().toISOString()).format("yyyy-MM-DD")

          if (currentUserQuest) {
            const lastClaimed = moment.utc(currentUserQuest.extendedUserQuestData?.lastClaimed).format("yyyy-MM-DD")

            if (today <= lastClaimed) {
              return res.status(200).json({
                isError: true,
                message: 'This quest already claimed today! Wait until next day',
              })
            }

            extendedUserQuestData = { ...currentUserQuest.extendedUserQuestData } as any
          
            const diff = moment.utc(today).diff(
              lastClaimed,
              'days',
              true,
            )

            if (!lastClaimed || diff > 1) {
              //reset in_a_row
              extendedUserQuestData.in_a_row = 1
            } else {
              extendedUserQuestData.in_a_row++
            }
            extendedUserQuestData.count++

          } else {
            //first time claim daily
            extendedUserQuestData = { ...currentQuest.extendedQuestData }
            extendedUserQuestData.in_a_row = 1;
            extendedUserQuestData.count = 1;
          }

          /***** */
          extendedUserQuestData.lastClaimed = today

          userQuest = await claimUserDailyQuestTransaction(
            questId,
            rewardTypeId,
            quantity,
            extendedUserQuestData,
            userId,
          )
        } else {
          if (currentUserQuest.hasClaimed) {
            const error = 'This quest has been claimed before.'
            return res.status(200).json({
              isError: true,
              message: error,
            })
          }
          if (!currentUserQuest.isClaimable) {
            const error = 'This quest cannot be claimed yet.'
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
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}


export default whitelistUserMiddleware(userQuestSubmitMiddleware(claimIndividualQuestAPI))
// let yesterday = moment.utc().subtract(1, 'day').toDate();