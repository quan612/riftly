import { prisma } from 'context/PrismaContext'

export const getAllEnableQuestsForUser = async () => {
  return await prisma.quest.findMany({
    where: {
      isEnabled: true,
      isDeleted: false,
    },
    include: {
      rewardType: true,
      type: true,
    },
  })
}

export const getQuestsStartedByThisUser = async (userId) => {
  return await prisma.userQuest.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      quest: {
        include: {
          type: true,
        },
      },
    },
  })
}

export const getQuestById = async (questId) => {
  return prisma.quest.findUnique({
    where: { questId },
    include: {
      userQuests: {
        include: {
          user: true,
        },
      },
      type: true,
    },
  })
}

export const getQuestType = async (type) => {
  return await prisma.questType.findUnique({
    where: { name: type },
  })
}

export const getQuestByTypeId = async (questTypeId) => {
  return await prisma.quest.findFirst({
    where: {
      questTypeId,
    },
  })
}
