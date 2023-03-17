import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import { getClaimedRewardsOfUser } from 'repositories/reward'

const getClaimedRewardForUserAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.query
        const whiteListUser = req.whiteListUser

        if (whiteListUser.userId !== userId) {
          console.error("Diffrent querying user id!")
          console.error(userId)
          console.error(whiteListUser.userId)
          return res.status(200).json({ isError: true, message: 'Not allowed to see point of others.' })
        }

        const rewarded = await getClaimedRewardsOfUser(userId)

        res.status(200).json(rewarded)
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(getClaimedRewardForUserAPI)
