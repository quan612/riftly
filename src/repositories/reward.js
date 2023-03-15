import { prisma } from 'context/PrismaContext'

export const createPendingReward = async (rewardTypeId, quantity, user) => {
  const { userId } = user
  return await prisma.pendingReward.create({
    data: {
      quantity,
      isClaimed: false,
      rewardType: {
        connect: {
          id: parseInt(rewardTypeId),
        },
      },
      user: {
        connect: {
          userId,
        },
      },
    },
    include: {
      rewardType: true,
      user: true,
    },
  })
}

export const createReward = async (rewardTypeId, quantity, userId) => {
  return await prisma.reward.upsert({
    where: {
      userId_rewardTypeId: { userId, rewardTypeId },
    },

    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      // userId,
      // rewardTypeId,
      quantity,
      rewardType: {
        connect: {
          id: parseInt(rewardTypeId),
        },
      },
      user: {
        connect: {
          userId,
        },
      },
    },

    include: {
      rewardType: true,
      user: true,
    },
  })
}

export const searchPendingRewardBasedOnGeneratedURL = async (generatedURL, user) => {
  const { userId } = user
  return await prisma.pendingReward.findFirst({
    where: {
      generatedURL,
      userId,
    },
    include: {
      rewardType: true,
    },
  })
}

export const getClaimedRewardsOfUser = async (userId) => {
  return await prisma.reward.findMany({
    where: { userId },
    include: { rewardType: true },
  })
}

export const getRewardType = async (rewardTypeId) => {
  return await prisma.rewardType.findFirst({
    where: { id: rewardTypeId },
  })
}

export const AddOrUpdateWhiteListAddressTable = async (wallet) => {
  return await prisma.whiteListAddress.upsert({
    where: { wallet },
    update: {
      wallet,
    },
    create: {
      wallet,
    },
  })
}

export const getAllRewardTypes = async () => {
  return await prisma.rewardType.findMany({
    where: {
      // isEnabled: true
    },
  })
}
