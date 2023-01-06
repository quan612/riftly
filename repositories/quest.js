import { prisma } from "context/PrismaContext";

export const questUpsert = async (
    questId,
    questTypeId,
    description,
    text,
    completedText,
    rewardTypeId,
    quantity,
    isEnabled,
    isRequired,
    extendedQuestData
) => {

    return await prisma.quest.upsert({
        where: {
            id: questId || -1,
        },
        create: {
            type: {
                connect: {
                    id: parseInt(questTypeId),
                },
            },
            description,
            text,
            completedText,
            rewardType: {
                connect: {
                    id: parseInt(rewardTypeId),
                },
            },
            quantity,
            isEnabled,
            isRequired,
            extendedQuestData,
        },
        update: {
            description,
            text,
            completedText,
            rewardType: {
                connect: {
                    id: parseInt(rewardTypeId),
                },
            },
            quantity,
            isEnabled,
            //isRequired,
            extendedQuestData,
        },
    });
};

export const getAllEnableQuestsForUser = async () => {
    return await prisma.quest.findMany({
        where: {
            isEnabled: true,
            isDeleted: false
        },
        include: {
            rewardType: true,
            type: true,
        },
    });
};

export const getQuestsDoneByThisUser = async (userId) => {
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
    });
};

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
    });
};

export const getQuestType = async (type) => {
    return await prisma.questType.findUnique({
        where: { name: type },
    });
};

export const getQuestByTypeId = async (questTypeId) => {
    return await prisma.quest.findFirst({
        where: {
            questTypeId,
        },
    });
};
