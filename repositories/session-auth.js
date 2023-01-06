import { prisma } from "../context/PrismaContext";
import { utils } from "ethers";

export const isWhiteListUser = async (session) => {
    if (!session) {
        return null;
    }
    // session login through discord
    let user;

    if (session?.provider === "discord") {

        user = await prisma.whiteList.findFirst({
            where: {
                discordId: session?.user?.id,
            },
        });
    }

    if (session?.provider === "twitter") {
        user = await prisma.whiteList.findFirst({
            where: {
                twitterId: session?.user?.id,
            },
        });
    }

    // session login through wallet
    if (session?.user?.address) {
        user = await prisma.whiteList.findUnique({
            where: {
                wallet: utils.getAddress(session?.user?.address),
            },
        });
    }

    if (!user) {
        return null;
    }
    return user;
};

export const isAdmin = async (session) => {
    if (!session || !session.user?.isAdmin) {
        return false;
    }
    return true;
};
