import { prisma } from "@context/PrismaContext";
import { PAGINATION_SKIP } from "@enums/index";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';

let skipNumber = PAGINATION_SKIP

const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
        try {
            const currentPage = req.query?.page;

            let searchRes = {};

            // console.time(`RESPONSE TIME request ${currentPage}`)
            const users = await prisma.whiteList.findMany({
                skip: currentPage * skipNumber,
                take: skipNumber,
                select: {
                    wallet: true,
                    twitterUserName: true,
                    twitterId: true,
                    discordUserDiscriminator: true,
                    whiteListUserData: true,
                    email: true,
                    userId: true,
                    avatar: true,
                    createdAt: true,
                    updatedAt: true,
                    rewards: {
                        select: {
                            rewardTypeId: true,
                            rewardType: true,
                            quantity: true
                        }
                    },
                    userQuest: {
                        skip: 0,
                        take: 1,
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
                    // _count: {
                    //     select: {
                    //         userQuest: true
                    //     }
                    // },
                },
            });

            searchRes.users = users;

            // console.timeEnd(`RESPONSE TIME request ${currentPage}`)
            res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600, stale-while-revalidate');
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