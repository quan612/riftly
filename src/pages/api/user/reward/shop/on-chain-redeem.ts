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

const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {

  if (req.method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }

  const { userId, wallet } = req.whiteListUser
  const { id: shopItemId } = req.body
  const shopItem = req.shopItem

  if (!wallet || wallet.length < 16 || !utils.getAddress(wallet)) {
    return res
      .status(200)
      .json({ message: 'Wallet account not linked or invalid wallet address', isError: true })
  }

  try {

    const { cost, rewardTypeId } = await getShopRequirementCost(shopItem.requirements);

    /* actual redeeming on-chain */
    const {
      OPERATION_WALLET_PRIVATE_KEY,
    } = process.env

    
    const redeemedSlot = await prisma.shopItemRedeem.findFirst({
      where: {
        shopItemId,
        redeemedBy: {
          userId
        },
        status: RedeemStatus.PENDING
      }
    })

    const chain = shopItem?.chain;
    const network = shopItem?.network;

    const redeemContractAddress = getRedeemContractAddress(chain, network);

    const infuraProvider = getInfuraProvider(chain, network)

    const signerWallet = new ethers.Wallet(`0x${OPERATION_WALLET_PRIVATE_KEY}`, infuraProvider)

    const redeemContract = getRedeemContract(signerWallet, redeemContractAddress)

    const options = await getTransactionOption(infuraProvider)

    console.log("gasPrice: ", options.gasPrice.toString())

    let tx;


    await prisma.$transaction(
      async (tx:any) => {
        await tx.$executeRaw`select * from public."ShopItemRedeem" p where p."status"='AVAILABLE' FOR UPDATE;`;
        await sleep(500)

        const result = await tx.$executeRaw`UPDATE "ShopItemRedeem" SET "userId"=${userId}, "status"='PENDING' where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' and p."shopItemId"=${shopItemId}limit 1);`;

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
     

    if (shopItem.contractType === ContractType.ERC20) { // getting decimals of ERC20 contract
      const contractAddress = shopItem?.contractAddress;
      const ercContract = getContract(signerWallet, contractAddress, shopItem?.abi)

      const decimal = await ercContract.decimals()
      const multiplier = shopItem.multiplier;

      const parseDecimal =  ethers.utils.parseUnits("1", decimal);

      const amount = parseDecimal.mul(multiplier);
      const slotId = redeemedSlot.id


      tx = await redeemContract.redeemERC20(
        contractAddress,
        wallet,
        amount,
        slotId,
        options
      )
  

      const transactionHash = tx.hash

      const extendedRedeemData = {
        transactionHash: transactionHash
      }

      await prisma.shopItemRedeem.update({
        where: {
          id: redeemedSlot.id
        },
        data: {
          extendedRedeemData
        }
      })
      return res.status(200).json({ message: transactionHash })
    }

    if (shopItem.contractType === ContractType.ERC721) { 
      
      const contractAddress = shopItem?.contractAddress;
      const slotId = redeemedSlot.id

      tx = await redeemContract.redeemERC721(
        contractAddress,
        wallet,
        slotId,
        options
      )

      const transactionHash = tx.hash

      const extendedRedeemData = {
        transactionHash: transactionHash
      }

      await prisma.shopItemRedeem.update({
        where: {
          id: redeemedSlot.id
        },
        data: {
          extendedRedeemData
        }
      })



      const etherscanLink = getEtherscanLink(chain, network, transactionHash)
      return res.status(200).json({ message: etherscanLink })
    }
    if (shopItem.contractType === ContractType.ERC721A) { 
    console.log("redeem erc721a")
      const contractAddress = shopItem?.contractAddress;
      const slotId = redeemedSlot.id

      tx = await redeemContract.redeemERC721A(
        contractAddress,
        wallet,
        slotId,
        options
      )

      const transactionHash = tx.hash

      const extendedRedeemData = {
        transactionHash: transactionHash
      }

      await prisma.shopItemRedeem.update({
        where: {
          id: redeemedSlot.id
        },
        data: {
          extendedRedeemData
        }
      })
      

      const etherscanLink = getEtherscanLink(chain, network, transactionHash)
      return res.status(200).json({ message: etherscanLink })
    }
  },
  {
    maxWait: 10000,
    timeout: 30000,
  },
)
    return res.status(200).json({ isError: true, message: "Unhandled contract type" })

  } catch (error) {
    // console.log(error?.error?.reason)
    let errorMessage;

    if(error?.error?.reason){
      errorMessage = error?.error?.reason
    }
    else {
      errorMessage = error.message
    }
    return res.status(200).json({
      isError: true,
      message: errorMessage,
    })
  }
}
export default whitelistUserMiddleware(redeemMiddleware(handler))

function getContract(signerWallet, contractAddress, contractAbi) {

  return new ethers.Contract(
    utils.getAddress(contractAddress),
    contractAbi,
    signerWallet,
  )
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
  return ethers.utils.parseUnits(Math.ceil(data) + '', 'gwei');
}
const getEtherscanLink = (chain, network, transactionHash) => {

  if(chain === Chain.Ethereum){
    if(network === Network.EthereumMainnet){
      return `https://etherscan.io/tx/${transactionHash}`
    }

    if(network === Network.EthereumGoerli){
      return `https://goerli.etherscan.io/tx/${transactionHash}`
    }
  }

  if(chain === Chain.Polygon){
    if(network === Network.PolygonMainnet){
      return `https://polygonscan.com/tx/${transactionHash}`
    }

    if(network === Network.PolygonMumbai){
      return `https://mumbai.polygonscan.com/tx/${transactionHash}`
    }
  }

  if(chain === Chain.Arbitrum){
    if(network === Network.ArbitrumMainnet){
      return `https://arbiscan.io/tx/${transactionHash}`
    }

    if(network === Network.ArbitrumGoerli){
      return `https://goerli.arbiscan.io/tx/${transactionHash}`
    }
  }

  throw new Error(`Unsupported chain or network`)
}

const getRedeemContractAddress = (chain, network) => {

  if(chain === Chain.Ethereum){
    if(network === Network.EthereumMainnet){
      return process.env.REDEEM_ETHEREUM_MAINNET;
    }

    if(network === Network.EthereumGoerli){
      return process.env.REDEEM_ETHEREUM_GOERLI;
    }
  }

  if(chain === Chain.Polygon){
    if(network === Network.PolygonMainnet){
      return process.env.REDEEM_POLYGON_MAINNET;
    }

    if(network === Network.PolygonMumbai){
      return process.env.REDEEM_POLYGON_MUMBAI;
    }
  }

  if(chain === Chain.Arbitrum){
    if(network === Network.ArbitrumMainnet){
      return process.env.REDEEM_ARBITRUM_MAINNET;
    }

    if(network === Network.ArbitrumGoerli){
      return process.env.REDEEM_ARBITRUM_GOERLI="";
    }
  }

  throw new Error(`Unsupported chain or network for getting redeem contract`)
}

const getInfuraProvider = (chain, network) => {

  let infuraNetwork;
  if(chain === Chain.Ethereum){
    if(network === Network.EthereumMainnet){
      infuraNetwork="homestead";
    }

    if(network === Network.EthereumGoerli){
      infuraNetwork="goerli";
    }
  }
  if(chain === Chain.Polygon){
    if(network === Network.PolygonMainnet){
      infuraNetwork="matic";
    }

    if(network === Network.PolygonMumbai){
      infuraNetwork="maticmum";
    }
  }
  if(chain === Chain.Arbitrum){
    if(network === Network.ArbitrumMainnet){
      infuraNetwork="arbitrum";
    }

    if(network === Network.ArbitrumGoerli){
      infuraNetwork="arbitrum-goerli";
    }
  }
  console.log("infuraNetwork", infuraNetwork)
  return new ethers.providers.InfuraProvider(infuraNetwork, {
      projectId: process.env.NEXT_PUBLIC_INFURA_ID,
      projectSecret: process.env.INFURA_SECRET,
    })
}