import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import {
    submitUserQuestTransaction,
    submitUserDailyQuestTransaction,
} from "repositories/transactions";
import { getWhiteListUserByUserId } from "repositories/user";
import { ethers, utils } from "ethers";
import { EvmChain } from "@moralisweb3/evm-utils";

const Moralis = require("moralis").default;

const submitNftQuest = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const whiteListUser = req.whiteListUser;
            const { questId, rewardTypeId, quantity, extendedQuestData, inputCode } = req.body;
            let userQuest;
            try {
                // query the type based on questId
                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId,
                    },
                    include: {
                        type: true,
                    },
                });

                if (currentQuest.type.name !== Enums.OWNING_NFT_CLAIM) {
                    return res.status(200).json({
                        isError: true,
                        message: "This submit route is for NFT quest!",
                    });
                }

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        userId_questId: { userId: whiteListUser.userId, questId },
                    },
                });

                if (entry) {
                    console.log("This quest has been submitted before");
                    return res.status(200).json({
                        isError: true,
                        message: "This quest already submitted before!",
                    });
                }

                // check if user session has wallet address
                const currentUser = await getWhiteListUserByUserId(whiteListUser.userId);
                const userWallet = currentUser?.wallet;

                if (
                    userWallet?.length > 0 &&
                    utils.getAddress(userWallet) &&
                    utils.isAddress(userWallet)
                ) {
                    let chainConfigure = currentQuest.extendedQuestData.chain;
                    let chain;
                    if (!chainConfigure) {
                        return res.status(200).json({
                            isError: true,
                            message: "Missing chain configure value!",
                        });
                    }

                    switch (chainConfigure) {
                        case "mainnet":
                            chain = EvmChain.ETHEREUM;
                            break;
                        case "polygon":
                            chain = EvmChain.POLYGON;
                            break;
                        default:
                            throw new Error("Invalid configure chain value");
                    }

                    let haveNft = false;

                    await Moralis.start({
                        apiKey: process.env.MORALIS_API_KEY,
                        // ...other configuration
                    });

                    // since there is a limit of 100 per query, we need to continue until the cursor is null in case a user owns more than 100 nfts
                    let response;
                    let cursor = "";
                    let result = [];
                    do {
                        response = await Moralis.EvmApi.nft
                            .getWalletNFTs({
                                address: userWallet,
                                chain: chain,
                                cursor,
                            })
                            .then((r) => r.data);

                        for (const nft of response.result) {
                            result = [...result, nft];
                        }
                        cursor = response.cursor;
                    } while (cursor != null && cursor != "");

                    // moralis does not retrieve the correct upper case wallet address so we need to get the correct ones from ethers
                    haveNft = result.some(
                        (r) => utils.getAddress(r.token_address) === utils.getAddress(currentQuest.extendedQuestData.contract)
                    );

                    if (haveNft) {
                        await submitUserQuestTransaction(questId, rewardTypeId, whiteListUser);
                        return res.status(200).json(userQuest);
                    }
                    return res
                        .status(200)
                        .json({
                            isError: true,
                            message: "User does not own this Nft.",
                        });
                }
                return res
                    .status(200)
                    .json({
                        isError: true,
                        message: "Session not linked to a wallet.",
                    });
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message, questId });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(submitNftQuest);
