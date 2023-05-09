import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import { searchPendingRewardBasedOnGeneratedURL } from 'repositories/reward'
import { getWhiteListUserByUserName } from 'repositories/user'

const getPendingRewardApi = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      res.status(200).json({
        isError: true,
        message: `Disable path as not having any UI to claim from user perspective!`,
      })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(getPendingRewardApi)
