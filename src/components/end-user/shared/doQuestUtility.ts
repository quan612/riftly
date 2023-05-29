// Modules
import Enums from 'enums'
import { NextRouter } from 'next/router'

// Utils
import { getTwitterAuthLink, getDiscordAuthLink } from '@util/index'

// Types
import { Quest } from 'models/quest'
import { UseMutateAsyncFunction } from 'react-query/types/react/types'

/*@dev
 * if DISCORD_AUTH || TWITTER_AUTH, we do separated quest through redirect links
 * else submit a quest through api
 *
 */
export const doQuestUtility = async (
  router: NextRouter,
  quest: Quest,
  onSubmit: (submission) => Promise<UseMutateAsyncFunction>,
) => {
  const { questId, type, extendedQuestData } = quest

  if (type.name === Enums.UNSTOPPABLE_AUTH) {
    return router.push('/unstoppable/domain-auth')
  }
  if (type.name === Enums.WALLET_AUTH) {
    return router.push('/auth-wallet')
  }

  if (type.name === Enums.OWNING_NFT_CLAIM) {
    const path = `/nft-quest?nft=${extendedQuestData.nft}`
    return router.push(path)
  }

  if (type.name === Enums.DISCORD_AUTH) {
    const discordLink = await getDiscordAuthLink()

    return window.open(discordLink, '_self')
  }
  if (type.name === Enums.TWITTER_AUTH) {
    const twitterLink = await getTwitterAuthLink()
    return window.open(twitterLink, '_self')
  }
  if (type.name === Enums.JOIN_DISCORD) {
    const discordServer = extendedQuestData.discordServer
    window.open(`https://discord.com/invite/${discordServer}`, '_blank')
  }
  if (type.name === Enums.TWITTER_RETWEET) {
    window.open(
      `https://twitter.com/intent/retweet?tweet_id=${extendedQuestData.tweetId}`,
      '_blank',
    )
  }
  if (type.name === Enums.FOLLOW_TWITTER) {
    window.open(
      `https://twitter.com/intent/follow?screen_name=${extendedQuestData.followAccount}`,
      '_blank',
    )
  }
  if (type.name === Enums.FOLLOW_INSTAGRAM) {
    window.open(`https://www.instagram.com/${extendedQuestData.followAccount}`, '_blank')
  }
  const submission = {
    questId,
  }

  return await onSubmit(submission)
}
