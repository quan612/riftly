import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';
import axios from "axios";

const adminUpdateUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
        const { contract, chainId } = req.body;

        let moralisQuery = await prisma.moralisNftData.findUnique({
            where: {
                contractAddress: contract
            }
        })

        if (!moralisQuery || moralisQuery?.contractData?.length < 1) {
            console.log(`No moralis info, trying to fetch...`)
            await handleGetNftOwnersRequest(contract, chainId)
        } else {
            let twoDaysFromUpdateAt = new Date(moralisQuery.updatedAt).getTime() + 86400000 * 2
            let [twoDaysFromLastUpdatedAt] = new Date(twoDaysFromUpdateAt).toISOString().split("T");
            let [today] = new Date().toISOString().split("T");

            if (twoDaysFromLastUpdatedAt < today) {
                console.log(`there is moralisQuery, but it is more than 2 days so we fetch using moralis`)
                await handleGetNftOwnersRequest(contract, chainId)
            }
            else {
                console.log(`nft moralisQuery found and is new, return`)
                return res.status(200).json({ isStale: false });
            }
        }
        return res.status(200).json({ isStale: true });
    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUpdateUserStatsAPI));

const handleGetNftOwnersRequest = async (contractAddress, chainId) => {
    return await axios
        .post(
            `${process.env.DISCORD_NODEJS}/api/v1/user-stats/getContractOwnersJobRequest`,
            {
                contractAddress, chainId
            },
            {
                headers: {
                    Authorization: `Bot ${process.env.NODEJS_SECRET}`,
                    "Content-Type": "application/json",
                },
            }
        ).catch((error) => {
            throw new ApiError(400, `NodeJs server error: ${error?.message}`)
        })
};
