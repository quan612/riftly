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
// const getPendingRewardApi = async (req, res) => {
//   const { method } = req

//   switch (method) {
//     case 'GET':
//       try {
//         return res.status(200).json({
//           isError: true,
//           message: `Disable path as not having any UI to claim from user perspective!`,
//         })

//         const whiteListUser = req.whiteListUser
//         const { username, generatedURL } = req.query
//         if (!username) return res.status(200).json({ message: 'Await' })

//         console.log(`** Finding user for pending reward, username: ${username} **`)
//         let user = await getWhiteListUserByUserName(username)
//         if (!user) {
//           return res.status(200).json({
//             message: `Cannot find any record for user ${username}`,
//             isError: true,
//           })
//         }

//         console.log(`** Finding pending reward **`)
//         let pendingReward = await searchPendingRewardBasedOnGeneratedURL(generatedURL, user)

//         if (pendingReward.userId !== whiteListUser.userId) {
//           return res.status(200).json({
//             message: `User ${whiteListUser.wallet ? whiteListUser.wallet : whiteListUser.userId
//               } does not own this reward `,
//             isError: true,
//           })
//         }

//         res.status(200).json({ pendingReward })
//       } catch (err) {
//         // console.log(err);
//         res.status(500).json({ err })
//       }
//       break

//     default:
//       res.setHeader('Allow', ['GET'])
//       res.status(405).end(`Method ${method} Not Allowed`)
//   }
// }
export default whitelistUserMiddleware(getPendingRewardApi)
