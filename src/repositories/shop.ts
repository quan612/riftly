import { prisma } from '@context/PrismaContext'
import { RequirementType } from 'models/requirement-type'
import {  utils } from 'ethers'
import { Reward } from 'models/reward'
import { ShopItemRequirement } from 'models/shop-item-requirement'

export const getAllEnabledShopItems = async () => {
  return await prisma.shopItem.findMany({
    where: {
      isEnabled: true
    },
    include: {
      requirements: true,
      shopItemRedeem: true
    }
  })
}

export const getShopItemByContractAddress = async (contract) => {
  return prisma.shopItem.findUnique({
    where: {
      contractAddress: utils.getAddress(contract)
    }
  })
}


export const getShopRequirementCost = async (requirements: ShopItemRequirement[]): Promise<{cost: number, rewardTypeId:number}> => {
  const reward: Reward = await prisma.reward.findFirst({
    where: {
      rewardType: {
        OR: [
          {
            reward: "Points",
          },
          {
            reward: "Point",
          },
        ]

      }
    }
  })

  if (!reward) {
    return { cost: 0, rewardTypeId: -1 };
  }

  let cost = 0;
  await Promise.all(requirements.map(r => {
    if (r.requirementType === RequirementType.REWARD && parseInt(r.relationId.toString()) === parseInt(reward.rewardTypeId.toString())) {
      cost = r?.conditional?.has
    }
  }))

  return { cost, rewardTypeId: reward.rewardTypeId };
}