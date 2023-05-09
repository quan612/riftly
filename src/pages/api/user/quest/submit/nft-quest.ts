import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { submitUserQuestTransaction } from 'repositories/transactions'
import { getWhiteListUserByUserId } from 'repositories/user'
import { utils } from 'ethers'
import { EvmChain } from '@moralisweb3/evm-utils'
import Moralis from 'moralis'
import { fivePerMinuteRateLimit } from '@middlewares/applyRateLimit'
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { Quest } from 'models/quest'
import { UserQuest } from 'models/user-quest'

const submitNftQuest = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ isError: true, message: 'Only POST' })
  }
  const { userId } = req.whiteListUser
  const { questId } = req.body
  let userQuest

  try {
    const currentQuest: Quest = await prisma.quest.findUnique({
      where: {
        questId,
      },
      include: {
        type: true,
      },
    })

    if (currentQuest.type.name !== Enums.OWNING_NFT_CLAIM) {
      return res.status(200).json({
        isError: true,
        message: 'This submit route is for NFT quest!',
      })
    }

    const currentUserQuest: UserQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: { userId, questId },
      },
    })
    if (currentUserQuest) {
      throw new Error('This quest has been submitted before')
    }

    const entry = await prisma.userQuest.findUnique({
      where: {
        userId_questId: { userId, questId },
      },
    })

    if (entry) {
      return res.status(200).json({
        isError: true,
        message: 'This quest has been submitted.',
      })
    }

    // check if user session has wallet address
    const currentUser = await getWhiteListUserByUserId(userId)
    const userWallet = currentUser?.wallet

    if (userWallet?.length > 0 && utils.getAddress(userWallet) && utils.isAddress(userWallet)) {
      const chainConfigure = currentQuest.extendedQuestData.chain
      let chain
      if (!chainConfigure) {
        return res.status(200).json({
          isError: true,
          message: 'Missing chain configure value!',
        })
      }

      switch (chainConfigure) {
        case 'mainnet':
          chain = EvmChain.ETHEREUM
          break
        case 'polygon':
          chain = EvmChain.POLYGON
          break
        default:
          throw new Error('Invalid configure chain value')
      }

      let haveNft = false

      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        })
      }

      const { extendedQuestData } = currentQuest

      // since there is a limit of 100 per query, we need to continue until the cursor is null in case a user owns more than 100 nfts
      let response
      let cursor = ''
      let result = []
      const tokenAddresses = []

      tokenAddresses.push(utils.getAddress(extendedQuestData.contract)) // adding filter to fasten the search instead of going through all nfts

      do {
        response = await Moralis.EvmApi.nft
          .getWalletNFTs({
            address: userWallet,
            chain,
            tokenAddresses,
            cursor,
          })
          .then((r) => r?.raw) //  or r?.jsonResponse)
          .catch((err) => {
            throw err
          })

        for (const nft of response.result) {
          result = [...result, nft]
        }
        cursor = response.cursor
      } while (cursor != null && cursor != '')

      // moralis does not retrieve the correct upper case wallet address so we need to get the correct ones from ethers
      haveNft = result.some(
        (r) => utils.getAddress(r.token_address) === utils.getAddress(extendedQuestData.contract),
      )

      await fivePerMinuteRateLimit(req, res)
      if (haveNft) {
        await submitUserQuestTransaction(questId, userId)
        return res.status(200).json(userQuest)
      }
      return res.status(200).json({
        isError: true,
        message: "You don't own this Nft.",
      })
    }
    return res.status(200).json({
      isError: true,
      message: 'Session not linked to a wallet for contract verification.',
    })
  } catch (error) {
    console.log(error)
    res.status(200).json({ isError: true, message: error.message, questId })
  }
}

export default whitelistUserMiddleware(submitNftQuest)
