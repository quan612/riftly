import { prisma } from "@context/PrismaContext";
import { getWhiteListUserByUserId } from "repositories/user";
import { adminMiddleware } from "middlewares/";
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Moralis = require("moralis").default;
const ethers = require("ethers");

const handler = async (req, res) => {
    const { method } = req;

    const { params } = req.query;

    if (params.length < 2) {
        return res.status(200).json({ isError: true, message: "Invalid params" });
    }

    let wallet = params[0];
    let chainName = params[1];
    let chainId = getChainId(chainName)

    if (!wallet || !ethers.utils.getAddress(wallet)) {
        return res.status(200).json({ isError: true, message: "Missing query." });
    }
    if (!chainId || chainId === 0) {
        return res.status(200).json({ isError: true, message: "Invalid chain." });
    }

    switch (method) {
        case "GET":
            try {

                let user = await prisma.whiteList.findUnique({
                    where: {
                        wallet
                    },
                    select: {
                        wallet: true,
                        twitterUserName: true,
                        discordUserDiscriminator: true,
                        whiteListUserData: true,
                        userId: true,
                        whiteListUserData: {
                            select: { eth: true, followers: true }
                        }
                    },
                });

                if (!Moralis.Core.isStarted) {
                    await Moralis.start({
                        apiKey: process.env.MORALIS_API_KEY,
                        // ...other configuration
                    });
                }

                res.setHeader('Cache-Control', 'max-age=0, s-maxage=10, stale-while-revalidate');
                res.status(200).json(user);
            } catch (err) {

                res.status(200).json({ isError: true, message: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(handler);


const getChainId = (chainName) => {
    // "eth", "polygon"
    switch (chainName) {
        case "eth":
            return 1;
        case "polygon":
            return 137;
        default:
            return 0;
    }
}