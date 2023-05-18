import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

import { ContractType, Prisma, RedeemStatus } from '@prisma/client'
import { sleep } from '@util/index'
import Enums from '@enums/index'
import { ethers, utils } from 'ethers'
import redeemMiddleware from '@middlewares/redeemMiddleware'
import { getShopRequirementCost } from 'repositories/shop'
import { CURRENT_NETWORK } from 'const/GlobalData'
import { redeemShopRateLimit } from '@middlewares/applyRateLimit'

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { Chain, Network } from 'models/chain'
import { ShopItem } from 'models/shop-item'

const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }

  const { userId, wallet } = req.whiteListUser
  const { id: shopItemId } = req.body
  const shopItem: ShopItem = req.shopItem

  if (shopItem.contractType !== ContractType.ERC1155) {
    return res.status(200).json({ message: 'only for 1155', isError: true })
  }

  if (!wallet || wallet.length < 16 || !utils.getAddress(wallet)) {
    return res
      .status(200)
      .json({ message: 'Wallet account not linked or invalid wallet address', isError: true })
  }

  const { cost, rewardTypeId } = await getShopRequirementCost(shopItem.requirements)

  /* actual redeeming on-chain */
  const { OPERATION_WALLET_PRIVATE_KEY } = process.env

  const chain = shopItem?.chain
  const network = shopItem?.network

  try {
    await prisma.$transaction(
      async (tx: any) => {
        await tx.$executeRaw`select * from public."ShopItemRedeem" p where p."status"='AVAILABLE' and p."shopItemId"=${shopItemId} ORDER BY id ASC LIMIT 1 FOR UPDATE SKIP LOCKED;`
        // await sleep(500)

        const currentTime = new Date().toISOString().split('Z')[0].replace('T', ' ').toString()

        const result =
          await tx.$executeRaw`UPDATE "ShopItemRedeem" SET "userId"=${userId}, "status"='PENDING', "updatedAt"=CAST(${currentTime} AS timestamp) where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' and p."shopItemId"=${shopItemId} ORDER BY id ASC LIMIT 1);`

        if (result === 0) {
          throw new Error(`${shopItem.title} is redeemed all`)
        }

        await tx.reward.update({
          where: {
            userId_rewardTypeId: { userId, rewardTypeId },
          },
          data: {
            quantity: {
              decrement: cost,
            },
          },
        })
      },
      {
        maxWait: 10000,
        timeout: 30000,
      },
    )
  } catch (error) {
    // error here would revert transaction automatically
    return res.status(200).json({
      isError: true,
      message: error.message,
    })
  }


  const redeemContractAddress = getRedeemContractAddress(chain, network)

  const infuraProvider = getInfuraProvider(chain, network)

  const signerWallet = new ethers.Wallet(`0x${OPERATION_WALLET_PRIVATE_KEY}`, infuraProvider)

  const redeemContract = getRedeemContract(signerWallet, redeemContractAddress)

  const options = await getTransactionOption(infuraProvider)

  const redeemedSlot = await prisma.shopItemRedeem.findFirst({
    where: {
      shopItemId,
      redeemedBy: {
        userId,
      },
      status: RedeemStatus.PENDING,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const contractAddress = shopItem?.contractAddress
  const slotId = redeemedSlot.id

  console.log("redeemed Slot", redeemedSlot)

  let tx

  try {
  
    tx = await redeemContract.redeemERC1155(
      contractAddress,
      wallet,
      shopItem.tokenId,
      slotId,
      options,
    )
  } catch (error) {
    console.log('need to revert transaction manual')


    await prisma.reward.update({
      where: {
        userId_rewardTypeId: { userId, rewardTypeId },
      },
      data: {
        quantity: {
          increment: cost,
        },
      },
    })

    await prisma.shopItemRedeem.update({
      where: {
        id: redeemedSlot.id,
      },
      data: {
        userId: null,
        status: RedeemStatus.AVAILABLE
      },
    })


    let errorMessage

    if (error?.error?.reason) {
      errorMessage = error?.error?.reason
    } else {
      errorMessage = error.message
    }
    return res.status(200).json({
      isError: true,
      message: errorMessage,
    })
  }

  const transactionHash = tx.hash

  const extendedRedeemData = {
    transactionHash: transactionHash,
  }

  await prisma.shopItemRedeem.update({
    where: {
      id: redeemedSlot.id,
    },
    data: {
      extendedRedeemData,
    },
  })

  const etherscanLink = getEtherscanLink(chain, network, transactionHash)

  return res.status(200).json({ message: etherscanLink })
}
export default whitelistUserMiddleware(redeemMiddleware(handler))

const acquireRedeemSlot = () => {}

function getContract(signerWallet, contractAddress, contractAbi) {
  return new ethers.Contract(utils.getAddress(contractAddress), contractAbi, signerWallet)
}

function getRedeemContract(signerWallet, redeemContractAddress) {
  const redeemContractJson = require('./redeem-contract.json')

  return new ethers.Contract(
    utils.getAddress(redeemContractAddress),
    redeemContractJson,
    signerWallet,
  )
}
async function getTransactionOption(infuraProvider) {
  const feeData = await infuraProvider.getFeeData()
  return {
    gasPrice: feeData.gasPrice.mul(110).div(100),
  }
}
function parse(data) {
  return ethers.utils.parseUnits(Math.ceil(data) + '', 'gwei')
}
const getEtherscanLink = (chain, network, transactionHash) => {
  if (chain === Chain.Ethereum) {
    if (network === Network.EthereumMainnet) {
      return `https://etherscan.io/tx/${transactionHash}`
    }

    if (network === Network.EthereumGoerli) {
      return `https://goerli.etherscan.io/tx/${transactionHash}`
    }
  }

  if (chain === Chain.Polygon) {
    if (network === Network.PolygonMainnet) {
      return `https://polygonscan.com/tx/${transactionHash}`
    }

    if (network === Network.PolygonMumbai) {
      return `https://mumbai.polygonscan.com/tx/${transactionHash}`
    }
  }

  if (chain === Chain.Arbitrum) {
    if (network === Network.ArbitrumMainnet) {
      return `https://arbiscan.io/tx/${transactionHash}`
    }

    if (network === Network.ArbitrumGoerli) {
      return `https://goerli.arbiscan.io/tx/${transactionHash}`
    }
  }

  throw new Error(`Unsupported chain or network`)
}

const getRedeemContractAddress = (chain, network) => {
  if (chain === Chain.Ethereum) {
    if (network === Network.EthereumMainnet) {
      return process.env.REDEEM_ETHEREUM_MAINNET
    }

    if (network === Network.EthereumGoerli) {
      return process.env.REDEEM_ETHEREUM_GOERLI
    }
  }

  if (chain === Chain.Polygon) {
    if (network === Network.PolygonMainnet) {
      return process.env.REDEEM_POLYGON_MAINNET
    }

    if (network === Network.PolygonMumbai) {
      return process.env.REDEEM_POLYGON_MUMBAI
    }
  }

  if (chain === Chain.Arbitrum) {
    if (network === Network.ArbitrumMainnet) {
      return process.env.REDEEM_ARBITRUM_MAINNET
    }

    if (network === Network.ArbitrumGoerli) {
      return (process.env.REDEEM_ARBITRUM_GOERLI = '')
    }
  }

  throw new Error(`Unsupported chain or network for getting redeem contract`)
}

const getInfuraProvider = (chain, network) => {
  let infuraNetwork
  if (chain === Chain.Ethereum) {
    if (network === Network.EthereumMainnet) {
      infuraNetwork = 'homestead'
    }

    if (network === Network.EthereumGoerli) {
      infuraNetwork = 'goerli'
    }
  }
  if (chain === Chain.Polygon) {
    if (network === Network.PolygonMainnet) {
      infuraNetwork = 'matic'
    }

    if (network === Network.PolygonMumbai) {
      infuraNetwork = 'maticmum'
    }
  }
  if (chain === Chain.Arbitrum) {
    if (network === Network.ArbitrumMainnet) {
      infuraNetwork = 'arbitrum'
    }

    if (network === Network.ArbitrumGoerli) {
      infuraNetwork = 'arbitrum-goerli'
    }
  }
  console.log('infuraNetwork', infuraNetwork)
  return new ethers.providers.InfuraProvider(infuraNetwork, {
    projectId: process.env.NEXT_PUBLIC_INFURA_ID,
    projectSecret: process.env.INFURA_SECRET,
  })
}
