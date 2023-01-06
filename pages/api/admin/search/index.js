import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const adminSearchAPI = async (req, res) => {
    const { method } = req;
    const currentPage = req.query.page;

    switch (method) {
        case "POST":
            const { wallet, twitter, discord, rewards } = req.body;

            let searchRes = {}, userCondition = {

            },
                rewardCondition = [], mintAddress = [];

            if (wallet !== "") {
                userCondition.wallet = { contains: wallet.trim() };
            }
            if (twitter !== "") {
                userCondition.twitterUserName = { contains: twitter.trim() };
            }
            if (discord !== "") {
                userCondition.discordUserDiscriminator = { contains: discord.trim() };
            }

            if (rewards.length > 0) {
                rewards.forEach((reward) => {
                    rewardCondition.push({
                        rewardTypeId: reward.typeId,
                        AND: [
                            {
                                quantity: {
                                    gte: parseInt(reward.minQty),
                                    lte: parseInt(reward.maxQty),
                                },
                            },
                        ],
                    });
                });
            }

            try {

                const userCount = await prisma.whiteList.count();
                let users = await prisma.whiteList.findMany({
                    where: userCondition,
                    skip: currentPage * 10000,
                    take: 10000,
                    orderBy: [
                        {
                            createdAt: "asc",
                        },
                    ],
                    select: {
                        userId: true,
                        wallet: true,
                        twitterUserName: true,
                        discordUserDiscriminator: true,
                        rewards: {
                            where: rewardCondition.length === 0 ? {} : { OR: rewardCondition },
                            select: {
                                quantity: true,
                                rewardType: true,
                            },
                        },
                    },
                });
                searchRes.userCount = userCount;
                searchRes.users = users;

                if (currentPage * 10000 >= userCount) {
                    searchRes.shouldContinue = false;
                } else {
                    searchRes.shouldContinue = true;
                }

                /*
                    Filtering white list address
                    let mintAddresses = await prisma.whiteListAddress.findMany();
                    let mintAddressArray = mintAddresses.map(el => el['wallet'])
 
                    searchRes = searchRes.filter((r) => {
                        if (mintAddressArray.includes(r.wallet))
                            return true;
                        else {
                            return false;
                        }
                    });
                */

                if (rewardCondition.length > 0) {
                    searchRes.users = searchRes.users.filter((r) => r.rewards.length > 0);

                }
                res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
                res.status(200).json(searchRes);

            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminSearchAPI);

export const config = {
    api: {
        responseLimit: '8mb',
    },
}
