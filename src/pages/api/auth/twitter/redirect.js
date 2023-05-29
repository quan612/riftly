import axios from 'axios'
import url from 'url'
import Enums from 'enums'
import { isWhiteListUser } from 'repositories/session-auth'
import { getQuestType, getQuestByTypeId } from 'repositories/quest'
import { updateTwitterUserQuestTransaction } from 'repositories/transactions'
import { prisma } from '@context/PrismaContext'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]'

const TOKEN_TWITTER_AUTH_URL = 'https://api.twitter.com/2/oauth2/token'
const USERINFO_TWITTER_URL = 'https://api.twitter.com/2/users/me'

// @dev this is used for twitter auth quest only
export default async function twitterRedirect(req, res) {
  const { method } = req
  if (method !== "GET") {
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    const whiteListUser = await isWhiteListUser(session)
    const { code } = req.query

    if (!code) {
      const error = 'Missing auth code. Please contact the administrator.'
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    const allConfigs = await prisma.questVariables.findFirst()
    const twitterId = allConfigs?.twitterId
    const twitterSecret = allConfigs?.twitterSecret
    const hostUrl = allConfigs.hostUrl

    if (!twitterId || !twitterSecret || hostUrl.trim().length < 1) {
      const error = 'Missing Twitter Client Configuration. Please contact the administrator.'
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
      const error = "Couldn't authenticate with Twitter Auth Oath2. Please contact administrator."
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    const userInfo = await axios.get(USERINFO_TWITTER_URL, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    })

    if (!userInfo) {
      const error = "Couldn't retrieve twitter info, pls retry later!"
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    //checked if existed
    const existingUser = await prisma.whiteList.findFirst({
      where: {
        twitterId: userInfo?.data?.data?.id,
      },
    })
    if (existingUser && existingUser.userId !== whiteListUser.userId) {
      const error = 'Attempt to authenticate same twitter Id on different users.'
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    const twitterAuthQuestType = await getQuestType(Enums.TWITTER_AUTH)
    if (!twitterAuthQuestType) {
      const error = 'Cannot find any quest of type twitter auth. Pleaes contact administrator.'
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    const twitterQuest = await getQuestByTypeId(twitterAuthQuestType.id)
    if (!twitterQuest) {
      const error = 'Cannot find any quest associated with twitter auth.'
      return res.status(200).redirect(`/quest-redirect?error=${error}`)
    }

    const questId = twitterQuest.questId
    if (whiteListUser) {
      const twitterQuestOfThisUser = await prisma.userQuest.findFirst({
        where: {
          userId: whiteListUser?.userId,
          questId,
        },
      })

      if (twitterQuestOfThisUser) {
        const error = 'Twitter quest has finished before.'
        return res.status(200).redirect(`/quest-redirect?error=${error}`)
      }
    }

    await updateTwitterUserQuestTransaction(
      twitterQuest,
      whiteListUser?.userId,
      userInfo.data.data,
    )

    const twitterSignUp = `Authenticated with Twitter successfully`
    res.status(200).redirect(`/quest-redirect?result=${twitterSignUp}`)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }
}
