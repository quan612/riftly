import { prisma } from '@context/PrismaContext'
import { ApiError } from 'next/dist/server/api-utils'

let skipNumber = 30000

const testAPI = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    try {
      console.log(process.env.VERCEL_REGION)
      var t0 = performance.now()

      await prisma.whiteList.findMany({
        skip: 0,
        take: skipNumber,
        // orderBy: [
        //     {
        //         createdAt: "asc",
        //     },
        // ],
        select: {
          // _count: {
          //     select: {
          //         userQuest: true
          //     }
          // },
          wallet: true,
          twitterUserName: true,
          discordUserDiscriminator: true,
          whiteListUserData: true,
          email: true,
          userId: true,
          avatar: true,
          createdAt: true,
          rewards: {
            select: {
              rewardTypeId: true,
              rewardType: true,
              quantity: true,
            },
          },
          userQuest: {
            skip: 0,
            take: 1,
            select: {
              quest: {
                select: {
                  text: true,
                },
              },
              updatedAt: true,
              hasClaimed: true,
            },
            orderBy: {
              updatedAt: 'desc',
            },
          },
        },
      })

      // searchRes.shouldContinue = false;
      var t1 = performance.now()

      console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')
      return res.json({
        timeItTook: t1 - t0,
      })
    } catch (error) {
      console.log(error)
      res.status(200).json({ isError: true, message: error.message })
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
