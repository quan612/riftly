import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

import { ContractType, Prisma, RedeemStatus } from '@prisma/client'
import { sleep } from '@util/index'
import axios from 'axios'
import Enums from '@enums/index'
import { ethers, utils } from 'ethers'
import redeemMiddleware from '@middlewares/redeemMiddleware'
import { getShopRequirementCost } from 'repositories/shop'
import { CURRENT_NETWORK } from 'const/GlobalData'
import { redeemShopRateLimit } from '@middlewares/applyRateLimit'


const handler = async (req, res) => {
  const { method } = req

  if (method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }
  console.log("ON-chain")
  // await redeemShopRateLimit(req, res)

  const { userId, wallet } = req.whiteListUser
  const { id: shopItemId } = req.body
  const shopItem = req.shopItem


  if (wallet.length < 16 || !utils.getAddress(wallet)) {
    return res
      .status(200)
      .json({ message: 'Wallet account not linked or invalid wallet address', isError: true })
  }

  try {

    const { cost, rewardTypeId } = await getShopRequirementCost(shopItem.requirements);

    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`select * from public."ShopItemRedeem" p where p."status"='AVAILABLE' FOR UPDATE;`;
        await sleep(3000)

        let result = await tx.$executeRaw`UPDATE "ShopItemRedeem" SET "userId"=${userId}, "status"='PENDING' where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' and p."shopItemId"=${shopItemId}limit 1);`;

        if (result === 0) {
          throw new Error(`${shopItem.title} is redeemed all`)
        }

        await tx.Reward.update({
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
        // isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10000,
        timeout: 30000,
      },
    )

    /* actual redeeming on-chain */
    const {
      OPERATION_WALLET_PRIVATE_KEY,
      NEXT_PUBLIC_INFURA_ID,
      INFURA_SECRET,
    } = process.env



    const redeemContractAddress = CURRENT_NETWORK.CONTRACT_ADDRESSES.REDEEM;
    const redeemedSlot = await prisma.shopItemRedeem.findFirst({
      where: {
        shopItemId,
        redeemedBy: {
          userId
        },
        status: RedeemStatus.PENDING
      }
    })

    const infuraProvider = new ethers.providers.InfuraProvider('goerli', {
      projectId: NEXT_PUBLIC_INFURA_ID,
      projectSecret: INFURA_SECRET,
    })

    const signerWallet = new ethers.Wallet(`0x${OPERATION_WALLET_PRIVATE_KEY}`, infuraProvider)

    const redeemContract = getRedeemContract(signerWallet, redeemContractAddress)

    const options = await getTransactionOption(infuraProvider)

    let tx;

    if (shopItem.contractType === ContractType.ERC20) { // getting decimals of ERC20 contract
      const contractAddress = shopItem?.contractAddress;
      const ercContract = getContract(signerWallet, contractAddress, shopItem?.abi)

      const decimal = await ercContract.decimals()
      const multiplier = shopItem.multiplier;

      const amount = ethers.utils.parseUnits("1", decimal) * multiplier;
      const slotId = redeemedSlot.id
      console.log("slot: ", slotId)

      tx = await redeemContract.redeemERC20(
        contractAddress,
        wallet,
        amount,
        slotId,
        options
      )
      // await tx.wait(1);

      const transactionHash = tx.hash

      let extendedRedeemData = {
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

    if (shopItem.contractType === ContractType.ERC721) { // getting decimals of ERC20 contract
      const contractAddress = shopItem?.contractAddress;
      const slotId = redeemedSlot.id

      console.log("slot: ", slotId)

      tx = await redeemContract.redeemERC721(
        contractAddress,
        wallet,
        slotId,
        options
      )

      const transactionHash = tx.hash

      let extendedRedeemData = {
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
    return res.status(200).json({ isError: true, message: "Unhandled contract type" })

  } catch (error) {
    console.log(error)
    return res.status(200).json({
      isError: true,
      message: error.message,
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
  let redeemContractJson = require('./redeem-contract.json')

  return new ethers.Contract(
    utils.getAddress(redeemContractAddress),
    redeemContractJson,
    signerWallet,
  )
}

async function getTransactionOption(infuraProvider) {
  const feeData = await infuraProvider.getFeeData()
  return {
    gasPrice: feeData.gasPrice.mul(110).div(100), //ethers.utils.parseUnits('200', 'gwei'),//gasPrice,        //ethers.utils.parseUnits('255', 'gwei'),
  }
}

function parse(data) {
  return ethers.utils.parseUnits(Math.ceil(data) + '', 'gwei');
}