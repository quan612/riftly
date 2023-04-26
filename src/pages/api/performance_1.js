import { prisma } from '@context/PrismaContext'
import { ApiError } from 'next/dist/server/api-utils'

let skipNumber = 1000

const testAPI = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {
      console.log(process.env.VERCEL_REGION)
      var t0 = performance.now()
      console.log("TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      // let test = await prisma.whiteList.findMany({
      //   skip: 0,
      //   take: skipNumber,
      //   // orderBy: [
      //   //     {
      //   //         createdAt: "asc",
      //   //     },
      //   // ],
      //   select: {
      //     wallet: true,
      //     twitterUserName: true,
      //     discordUserDiscriminator: true,
      //     whiteListUserData: true,
      //     email: true,
      //     userId: true,
      //     avatar: true,
      //     createdAt: true,
      //     rewards: {
      //       select: {
      //         rewardTypeId: true,
      //         rewardType: true,
      //         quantity: true,
      //       },
      //     },
      //     userQuest: {
      //       skip: 0,
      //       take: 1,
      //       select: {
      //         quest: {
      //           select: {
      //             text: true,
      //           },
      //         },
      //         updatedAt: true,
      //         hasClaimed: true,
      //       },
      //       orderBy: {
      //         updatedAt: 'desc',
      //       },
      //     },
      //   },
      // })
      // console.log(test.length)

      let questId = "639983ca-d885-4066-8b09-f6d8c5815449";
      let userId = '39ec5f63-31c3-42f4-81f9-15cbc8f94627'

      // const [currentQuest, currentUserQuest] = await Promise.all([
      //   await prisma.quest.findUnique({
      //     where: {
      //       questId: questId,
      //     },
      //     include: {
      //       type: true,
      //     },
      //   }),

      //   await prisma.UserQuest.findUnique({
      //     where: {
      //       userId_questId: { userId, questId },
      //     },
      //   })
      // ])

      // let currentQuest = await prisma.quest.findUnique({
      //   where: {
      //     questId: questId,
      //   },
      //   include: {
      //     type: true,
      //   },
      // })

      let currentUserQuest = await prisma.UserQuest.findUnique({
        where: {
          userId_questId: { userId, questId },
        },
      })

      // await prisma.$transaction([
      //   currentQuest,
      //   currentUserQuest

      // ]);

      // const test = await Promise.all([
      //   await prisma.quest.findUnique({
      //     where: {
      //       questId: questId,
      //     }, include: {
      //       type: true,
      //     },
      //   }),
      //   await prisma.UserQuest.findUnique({
      //     where: {
      //       userId_questId: { userId, questId },
      //     }
      //   })
      // ])
      // console.log(test)
      // console.log(currentQuest.length)
      // console.log(currentUserQuest.length)
      // let currentQuest = await prisma.quest.findUnique({
      //   where: {
      //     questId: questId,
      //   },
      //   include: {
      //     type: true,
      //   },
      // })

      // let currentUserQuest = await prisma.UserQuest.findUnique({
      //   where: {
      //     userId_questId: { userId, questId },
      //   },
      // })

      // await prisma.userQuest.upsert({
      //   where: {
      //     userId_questId: { userId, questId },
      //   },
      //   update: {
      //     isClaimable: true,
      //   },
      //   create: {
      //     userId,
      //     questId,
      //     isClaimable: true,
      //   },
      // })

      // searchRes.shouldContinue = false;
      var t1 = performance.now()

      console.log('Call took ' + (t1 - t0) + ' milliseconds.')
      return res.json({
        timeItTook: t1 - t0,
      })
    } catch (error) {
      console.log(error)
      return res.status(200).json({ isError: true, message: error.message })
    }
  }
  throw new ApiError(400, `Method ${req.method} Not Allowed`)
}

export default testAPI

export const config = {
  api: {
    responseLimit: 'none',
  },
}
