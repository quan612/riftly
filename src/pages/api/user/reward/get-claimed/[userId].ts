import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import { getClaimedRewardsOfUser } from 'repositories/reward'
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'

const getClaimedRewardForUserAPI = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.json({ isError: true, message: 'Only GET' })
  }

  try {
    const { userId } = req.query
    const whiteListUser = req.whiteListUser

    if (whiteListUser.userId !== userId) {
      return res.status(200).json({ isError: true, message: 'Not allowed to see point of others.' })
    }

    const rewarded = await getClaimedRewardsOfUser(userId)

    res.status(200).json(rewarded)
  } catch (error) {
    console.log(error)
    res.status(200).json({ isError: true, message: error.message })
  }
}

export default whitelistUserMiddleware(getClaimedRewardForUserAPI)
