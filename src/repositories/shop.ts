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
  const shops = await prisma.shopItem.findMany();

  return shops.filter(s => s.contractAddress === contract)[0]
}


export const getShopRequirementCost = async (
  requirements: ShopItemRequirement[],
): Promise<{ cost: number; rewardTypeId: number }> => {
  const rewardType: RewardType = await prisma.rewardType.findFirst({
    where: {
      OR: [
        {
          reward: 'Points',
        },
        {
          reward: 'Point',
        },
      ],
    },
  })

  if (!rewardType) {
    return { cost: 0, rewardTypeId: -1 }
  }

  let cost = 0
  await Promise.all(
    requirements.map((r) => {
      if (
        r.requirementType === RequirementType.REWARD &&
        parseInt(r.relationId.toString()) === parseInt(rewardType.id.toString())
      ) {
        cost = r?.conditional?.has
      }
    }),
  )

  return { cost, rewardTypeId: rewardType.id }
}