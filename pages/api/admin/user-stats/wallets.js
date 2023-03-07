import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';


const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {

        const { walletOwners } = req.body;
        let searchRes = {}, userCondition = {};

        try {

            let users = await prisma.whiteList.findMany({
                where: {
                    wallet: { in: walletOwners }
                },
                // skip: currentPage * 10000,
                // take: 10000,
                orderBy: [
                    {
                        createdAt: "asc",
                    },
                ],
                select: {
                    wallet: true,
                    twitterUserName: true,
                    discordUserDiscriminator: true,
                    whiteListUserData: true
                },
            });


            searchRes.users = users;

            res.setHeader('Cache-Control', 'max-age=0, s-maxage=60, stale-while-revalidate');
            return res.status(200).json(searchRes);
        } catch (error) {
            console.log(error)
            return res.status(200).json({ isError: true, message: error.message });
        }

    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUserStatsAPI));