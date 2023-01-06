import { prisma } from "@context/PrismaContext";

export const getWhiteListUserByUserName = async (username) => {
    return await prisma.whiteList.findFirst({
        where: {
            OR: [
                {
                    userId: username,
                },
                {
                    discordId: username,
                },
                {
                    twitterId: username,
                },
                {
                    wallet: username,
                },
                {
                    discordUserDiscriminator: username,
                },
                {
                    twitterUserName: username,
                },
            ],
        },
    });
};

export const getWhiteListUserByWallet = async (wallet) => {

    return await prisma.whiteList.findUnique({
        where: {
            // wallet: { equals: wallet, mode: "insensitive" },
            wallet
        },
    });
};

export const getWhiteListUserByUserId = async (userId) => {
    return await prisma.whiteList.findUnique({
        where: {
            userId,
        },
    });
};

export const addNewUser = async (wallet) => {
    return await prisma.whiteList.create({
        data: {
            wallet,
            discordId: null,
            discordUserDiscriminator: null,
            twitterId: null,
            twitterUserName: null,
        },
    });
};
