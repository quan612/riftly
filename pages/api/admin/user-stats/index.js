import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';


let skipNumber = 25
const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
        try {
            const currentPage = req.query?.page;
            let searchRes = {}, userCondition = {};

            const userCount = await prisma.whiteList.count();

            const users = await prisma.whiteList.findMany({
                where: userCondition,
                skip: currentPage * skipNumber,
                take: skipNumber,
                orderBy: [
                    {
                        createdAt: "asc",
                    },
                ],
                select: {
                    _count: {
                        select: {
                            userQuest: true
                        }
                    },
                    wallet: true,
                    twitterUserName: true,
                    discordUserDiscriminator: true,
                    whiteListUserData: true,
                    email: true,
                    userId: true,
                    avatar: true,
                    createdAt: true,
                    rewards: {
                        select: {
                            rewardTypeId: true,
                            rewardType: true,
                            quantity: true
                        }
                    },
                    userQuest: {
                        select: {
                            quest: {
                                select: {
                                    text: true,

                                }
                            },
                            updatedAt: true,
                            hasClaimed: true
                        },
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    }
                },
            });

            searchRes.userCount = userCount;
            searchRes.users = users;
            if (currentPage * skipNumber >= userCount) {
                searchRes.shouldContinue = false;
            } else {
                searchRes.shouldContinue = true;
            }

            searchRes.shouldContinue = false;
            res.setHeader('Cache-Control', 'max-age=0, s-maxage=18000, stale-while-revalidate');
            return res.status(200).json(searchRes);
        } catch (error) {
            console.log(error)
            return res.status(200).json({ isError: true, message: error.message });
        }

    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUserStatsAPI));

export const config = {
    api: {
        responseLimit: '8mb',
    },
}