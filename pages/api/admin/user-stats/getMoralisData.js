import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import { ApiError } from 'next/dist/server/api-utils';

const adminGetUserStatsDataAPI = async (req, res) => {
    if (req.method === "GET") {
        const { contractAddress } = req.query

        let data = await prisma.moralisNftData.findUnique({
            where: {
                contractAddress
            }
        })
        return res.status(200).json(data);
    }

    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default adminMiddleware(adminGetUserStatsDataAPI);
