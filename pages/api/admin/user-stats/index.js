import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';


let skipNumber = 10000
const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
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
                wallet: true,
                twitterUserName: true,
                discordUserDiscriminator: true,
                whiteListUserData: true,
                userId: true
            },
        });

        searchRes.userCount = userCount;
        searchRes.users = users;
        if (currentPage * skipNumber >= userCount) {
            searchRes.shouldContinue = false;
        } else {
            searchRes.shouldContinue = true;
        }

        // searchRes.shouldContinue = false;
        res.setHeader('Cache-Control', 'max-age=0, s-maxage=18000, stale-while-revalidate');
        return res.status(200).json(searchRes);
    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUserStatsAPI));