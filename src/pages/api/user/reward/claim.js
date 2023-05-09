import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

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


