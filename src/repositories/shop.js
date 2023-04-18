import { prisma } from '@context/PrismaContext'
import { RequirementType } from 'models/requirement-type'
import { ethers, utils } from 'ethers'

export const getAllEnabledShopItems = async () => {
  return await prisma.ShopItem.findMany({
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
  return prisma.ShopItem.findUnique({
    where: {
      contractAddress: utils.getAddress(contract)
    }
  })
}


export const getShopRequirementCost = async (requirements) => {
  const reward = await prisma.reward.findFirst({
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
    if (r.requirementType === RequirementType.REWARD && parseInt(r.relationId) === parseInt(reward.rewardTypeId)) {
      cost = r?.conditional?.has
    }
  }))

  return { cost, rewardTypeId: reward.rewardTypeId };
}