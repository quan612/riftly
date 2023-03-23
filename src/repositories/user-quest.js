import { prisma } from '@context/PrismaContext'
import { AccountStatus } from '@prisma/client'

export const getUserQuest = async (userId, questId) => {
  return await prisma.UserQuest.findUnique({
    where: {
      userId_questId: { userId, questId },
    },
  })
}

export const trackCorrectCodeQuestSubmit = async (userId, questId, extendedUserQuestData) => {
  return await prisma.UserQuest.upsert({
    where: {
      userId_questId: { userId, questId },
    },
    update: {
      isClaimable: true,
      extendedUserQuestData,
    },
    create: {
      userId,
      questId,
      isClaimable: true,
      extendedUserQuestData,
    },
  })
}

export const trackWrongCodeQuestSubmit = async (userId, questId, extendedUserQuestData) => {
  return await prisma.UserQuest.upsert({
    where: {
      userId_questId: { userId, questId },
    },
    update: {
      extendedUserQuestData,
    },
    create: {
      userId,
      questId,
      extendedUserQuestData,
    },
  })
}
