import { prisma } from 'context/PrismaContext'

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
