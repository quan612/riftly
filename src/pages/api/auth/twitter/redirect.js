import axios from 'axios'
import url from 'url'
import { getSession } from 'next-auth/react'
import Enums from 'enums'
import { isWhiteListUser } from 'repositories/session-auth'
import { getQuestType, getQuestByTypeId } from 'repositories/quest'
import { updateTwitterUserQuestTransaction } from 'repositories/transactions'
import { prisma } from '@context/PrismaContext'

const TOKEN_TWITTER_AUTH_URL = 'https://api.twitter.com/2/oauth2/token'
const USERINFO_TWITTER_URL = 'https://api.twitter.com/2/users/me'

// @dev this is used for twitter auth quest only
export default async function twitterRedirect(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const session = await getSession({ req })

        let whiteListUser = await isWhiteListUser(session)

        const { code } = req.query
        if (!code) {
          let error = 'Missing auth code. Please contact the administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        let allConfigs = await prisma.questVariables.findFirst()
        let twitterId = allConfigs?.twitterId
        let twitterSecret = allConfigs?.twitterSecret
        let hostUrl = allConfigs.hostUrl

        if (!twitterId || !twitterSecret || hostUrl.trim().length < 1) {
          let error = 'Missing Twitter Client Configuration. Please contact the administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const formData = new url.URLSearchParams({
          client_id: twitterId,
          client_secret: twitterSecret,
          grant_type: 'authorization_code',
          code: code.toString(),
          redirect_uri: `${hostUrl}/api/auth/twitter/redirect`,
          code_verifier: 'challenge',
        })

        const response = await axios.post(TOKEN_TWITTER_AUTH_URL, formData.toString(), {
          headers: {
            'Content-type': `application/x-www-form-urlencoded`,
          },
        })

        if (!response || !response?.data?.access_token) {
          let error = "Couldn't authenticate with Twitter Auth Oath2. Please contact administrator."
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const userInfo = await axios.get(USERINFO_TWITTER_URL, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        })

        if (!userInfo) {
          let error = "Couldn't retrieve twitter info, pls retry later!"
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        //checked if existed
        let existingUser = await prisma.whiteList.findFirst({
          where: {
            twitterId: userInfo?.data?.data?.id,
          },
        })
        if (existingUser && existingUser.userId !== whiteListUser.userId) {
          let error = 'Attempt to authenticate same twitter Id on different users.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        let twitterAuthQuestType = await getQuestType(Enums.TWITTER_AUTH)
        if (!twitterAuthQuestType) {
          let error = 'Cannot find any quest of type twitter auth. Pleaes contact administrator.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        let twitterQuest = await getQuestByTypeId(twitterAuthQuestType.id)
        if (!twitterQuest) {
          let error = 'Cannot find any quest associated with twitter auth.'
          return res.status(200).redirect(`/quest-redirect?error=${error}`)
        }

        const questId = twitterQuest.questId
        if (whiteListUser) {
          let twitterQuestOfThisUser = await prisma.userQuest.findFirst({
            where: {
              userId: whiteListUser?.userId,
              questId,
            },
          })

          if (twitterQuestOfThisUser) {
            let error = 'Twitter quest has finished before.'
            return res.status(200).redirect(`/quest-redirect?error=${error}`)
          }
        }

        await updateTwitterUserQuestTransaction(
          twitterQuest,
          whiteListUser?.userId,
          userInfo.data.data,
        )

        let twitterSignUp = `Authenticated with Twitter successfully`
        res.status(200).redirect(`/quest-redirect?result=${twitterSignUp}`)
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
