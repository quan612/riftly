import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';


const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
        const currentPage = req.query.page;
        let searchRes = {}, userCondition = {};

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
                wallet: true,
                twitterUserName: true,
                discordUserDiscriminator: true,
                whiteListUserData: true,
                userId: true
            },
        });

        searchRes.userCount = userCount;
        searchRes.users = users;
        if (currentPage * 10000 >= userCount) {
            searchRes.shouldContinue = false;
        } else {
            searchRes.shouldContinue = true;
        }

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=18000, stale-while-revalidate');
        return res.status(200).json(searchRes);
    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUserStatsAPI));