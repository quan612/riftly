import { prisma } from '@context/PrismaContext'
import axios from 'axios'
import url from 'url'
import { getSession } from 'next-auth/react'
import Enums from 'enums'
import { isWhiteListUser } from 'repositories/session-auth'
import { getQuestType, getQuestByTypeId } from 'repositories/quest'
import { updateDiscordUserQuestTransaction } from 'repositories/transactions'

const TOKEN_DISCORD_AUTH_URL = 'https://discord.com/api/oauth2/token'
const USERINFO_DISCORD_AUTH_URL = 'https://discord.com/api/users/@me'

// @dev this is used for discord auth quest only
export default async function discordRedirect(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const session = await getSession({ req })
        console.log("discord redirect runnning")
        let whiteListUser = await isWhiteListUser(session)

        const { code } = req.query
        if (!code) {
          let error = 'Missing auth code. Please contact the administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        let allConfigs = await prisma.questVariables.findFirst()
        let discordId = allConfigs?.discordId
        let discordSecret = allConfigs?.discordSecret
        let hostUrl = allConfigs.hostUrl

        if (!discordId || !discordSecret || hostUrl.trim().length < 1) {
          let error = 'Missing Server Configuration. Please contact the administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const formData = new url.URLSearchParams({
          client_id: discordId,
          client_secret: discordSecret,
          grant_type: 'authorization_code',
          code: code.toString(),
          redirect_uri: `${hostUrl}/api/auth/discord/redirect`,
        })

        let response
        try {
          response = await axios.post(TOKEN_DISCORD_AUTH_URL, formData.toString(), {
            headers: {
              'Content-type': `application/x-www-form-urlencoded`,
            },
          })
        } catch (error) {
          if (error.response.statusText === 'Unauthorized') {
            return res.status(200).redirect(`/quest-redirect?error=${error.response.statusText}`)
          } else throw error
        }

        if (!response || !response?.data?.access_token) {
          let error = "Couldn't authenticate with Discord. Please contact administrator."
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const userInfo = await axios.get(USERINFO_DISCORD_AUTH_URL, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        })

        if (!userInfo) {
          let error = 'Could not retrieve discord user information. Please contact administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        // checked if existed and existed user is different
        let existingUser = await prisma.whiteList.findFirst({
          where: {
            discordId: userInfo.data.id,
          },
        })
        if (existingUser && existingUser.userId !== whiteListUser?.userId) {
          let error = 'Attempt to authenticate same Discord Id on different users'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        // check if finished
        let discordAuthQuestType = await getQuestType(Enums.DISCORD_AUTH)
        if (!discordAuthQuestType) {
          let error = 'Cannot find quest type discord auth'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        let discordQuest = await getQuestByTypeId(discordAuthQuestType.id)
        if (!discordQuest) {
          let error = 'Cannot find quest associated with discord auth'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const questId = discordQuest.questId
        if (whiteListUser) {
          let discordQuestOfThisUser = await prisma.userQuest.findFirst({
            where: {
              userId: whiteListUser?.userId,
              questId,
            },
          })

          if (discordQuestOfThisUser) {
            console.log(discordQuestOfThisUser)
            let error = 'Discord quest has done before.'
            return res.status(200).redirect(`/quest-redirect?error=${error}`)
          }
        }

        await updateDiscordUserQuestTransaction(
          discordQuest.questId,
          whiteListUser?.userId,
          userInfo.data,
        )

        let discordSignUp = `Authenticated with Discord successfully`
        res.status(200).redirect(`/quest-redirect?result=${discordSignUp}`)
      } catch (err) {
        // console.log(err);
        res.status(200).json({ isError: true, error: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
