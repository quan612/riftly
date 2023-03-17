import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import axios from 'axios'
import { updateClaimAndPendingRewardTransaction } from 'repositories/transactions'

const userClaimRewardAPI = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      res.status(200).json({
        isError: true,
        message: `Disable path as not having any UI to claim from user perspective!`,
      })
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
// const userClaimRewardAPI = async (req, res) => {
//   const { method } = req

//   switch (method) {
//     case 'POST':
//       try {

//         const whiteListUser = req.whiteListUser
//         const { generatedURL, rewardTypeId, userId } = req.body

//         // DO NOT USE THE QUANTITY SENT TO API, USE THE QUANTITY QUERIED FROM DB
//         console.log(`** Checking if proper user ${userId} is claiming the reward **`)
//         if (whiteListUser.userId !== userId) {
//           return res.status(200).json({
//             message: 'Not authenticated to claim this reward.',
//             isError: true,
//           })
//         }

//         console.log(`** Assure this reward ${generatedURL} exists and not claimed **`)
//         const pendingReward = await prisma.pendingReward.findUnique({
//           where: {
//             userId_rewardTypeId_generatedURL: {
//               userId: whiteListUser.userId,
//               rewardTypeId,
//               generatedURL,
//             },
//           },
//           include: {
//             rewardType: true,
//           },
//         })

//         if (!pendingReward) {
//           return res.status(200).json({
//             isError: true,
//             message: `Cannot find reward associated to user ${userId}, url ${generatedURL}, please contact administrator!`,
//           })
//         }

//         if (pendingReward.isClaimed) {
//           return res.status(200).json({
//             isError: true,
//             message: `Reward is claimed previously!`,
//           })
//         }

//         let claimReward = await updateClaimAndPendingRewardTransaction(
//           whiteListUser,
//           rewardTypeId,
//           pendingReward,
//           generatedURL,
//         )

//         if (!claimReward) {
//           return res.status(200).json({
//             isError: true,
//             message: `Reward cannot be claimed for user ${userId} or already claimed, please contact administrator!`,
//           })
//         }

//         let discordChannels = await prisma.discord.findMany({
//           where: {
//             isEnabled: true,
//             postMessageWhenClaimed: true,
//           },
//         })

//         // need to post embeded message to a discord channel
//         if (discordChannels.length > 0) {
//           console.log('Posting embeded message to discord channels...')

//           let variables = await prisma.questVariables.findFirst()
//           const { discordBotToken } = variables

//           if (discordBotToken.trim().length < 1) {
//             //catch server error to indicate no message can be posted due to missing discord bot token
//             console.log('Missing bot token')
//           }

//           // post to discord
//           let receivingUser = getReceivingUser(whiteListUser)
//           let messageContent = `** ${receivingUser} has just claimed ${pendingReward.quantity} ${pendingReward?.rewardType?.reward}** `
//           let imageUrl = pendingReward.rewardType.rewardPreview

//           let discordPostOp = discordChannels.map(async (discord, index) => {
//             await axios
//               .post(
//                 `https://discord.com/api/channels/${discord.channelId}/messages`,
//                 {
//                   content: messageContent,
//                   embeds: [
//                     {
//                       image: {
//                         url: imageUrl,
//                       },
//                     },
//                   ],
//                 },
//                 {
//                   headers: {
//                     Authorization: `Bot ${discordBotToken}`,
//                     'Content-Type': 'application/json',
//                   },
//                 },
//               )
//               .catch((err) => {
//                 //catch server error to indicate an embeded message cannot be posted into a channel
//                 console.log('error posting message to discord channel')
//                 console.log(err)
//               })
//           })
//         }

//         res.status(200).json(pendingReward)
//       } catch (err) {
//         return res.status(200).json({ isError: true, message: err.message })
//       }
//       break
//     default:
//       res.setHeader('Allow', ['POST'])
//       res.status(405).end(`Method ${method} Not Allowed`)
//   }
// }


export default whitelistUserMiddleware(userClaimRewardAPI)

const getReceivingUser = (whiteListUser) => {
  if (whiteListUser.discordId != null && whiteListUser.discordId.trim().length > 0) {
    return `<@${whiteListUser.discordId.trim()}>`
  } else if (whiteListUser.uathUser != null && whiteListUser.uathUser.trim().length > 0) {
    return whiteListUser.uathUser
  } else if (
    whiteListUser.twitterUserName != null &&
    whiteListUser.twitterUserName.trim().length > 0
  ) {
    return whiteListUser.twitterUserName
  } else {
    return whiteListUser.userId
  }
}


