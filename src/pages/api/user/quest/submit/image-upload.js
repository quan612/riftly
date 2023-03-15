import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'

// const sharp = require('sharp');
import axios from 'axios'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
}

const submitImageQuestAPI = async (req, res) => {
  const { method } = req
  const whiteListUser = req.whiteListUser

  const { questId, extendedQuestData, imageBase64 } = req.body
  let userQuest
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

        if (currentQuest.type.name !== Enums.IMAGE_UPLOAD_QUEST) {
          return res.status(200).json({
            isError: true,
            message: 'This route is only for image-upload quest!',
          })
        }

        let entry = await prisma.userQuest.findUnique({
          where: {
            userId_questId: { userId: whiteListUser.userId, questId },
          },
        })
        if (entry) {
          return res
            .status(200)
            .json({ isError: true, message: 'This quest already submitted before!' })
        }

        let extendedUserQuestData = {
          ...extendedQuestData,
          imageBase64,
        }

        userQuest = await submitNewUserImageQuestTransaction(
          questId,
          currentQuest.rewardTypeId,
          currentQuest.quantity,
          extendedUserQuestData,
          whiteListUser,
        )
        if (!userQuest) {
          return res.status(200).json({ isError: true, message: 'User Quest cannot be submitted!' })
        }

        return res.status(200).json(userQuest)
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}


export default whitelistUserMiddleware(submitImageQuestAPI)

const submitNewUserImageQuestTransaction = async (
  questId,
  rewardTypeId,
  quantity,
  extendedUserQuestData,
  whiteListUser,
) => {
  let claimedReward

  console.log(`**Create / Update reward for user**`)
  const { userId } = whiteListUser
  claimedReward = prisma.reward.upsert({
    where: {
      userId_rewardTypeId: { userId, rewardTypeId },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId,
      quantity,
      rewardTypeId,
    },

    select: {
      userId: true,
      quantity: true,
      user: true,
      rewardTypeId: true,
      rewardType: true,
    },
  })

  console.log(`**Save to UserQuest, to keep track that its done**`)
  let userQuest = prisma.userQuest.create({
    data: {
      userId,
      questId,
      rewardedTypeId: rewardTypeId,
      rewardedQty: quantity,
      extendedUserQuestData,
    },
  })

  await prisma.$transaction([claimedReward, userQuest])

  return userQuest
}
