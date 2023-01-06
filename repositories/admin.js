import { prisma } from "../context/PrismaContext";

export const getAllRewardTypes = async () => {
    return await prisma.rewardType.findMany();
};
