import { prisma } from "context/PrismaContext";

export const updateUserQuest = async (
    userId,
    questId,
    rewardedTypeId,
    rewardedQty,
    extendedUserQuestData = null
) => {
    return await prisma.UserQuest.update({
        where: {
            userId_questId: { userId, questId },
        },
        data: {
            rewardedTypeId,
            rewardedQty,
            extendedUserQuestData:
                extendedUserQuestData !== null ? extendedUserQuestData : undefined,
        },
    });
};
