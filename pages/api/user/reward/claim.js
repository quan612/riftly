import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";
import { updateClaimAndPendingRewardTransaction } from "repositories/transactions";

const userClaimRewardAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                    return res.status(200).json({ isError: true, message: "Challenger is not enabled." });
                }
                const whiteListUser = req.whiteListUser;
                const { generatedURL, isClaimed, rewardTypeId, quantity, userId } =
                    req.body;

                // query discord backend and backend secret
                let variables = await prisma.questVariables.findFirst();

                const { discordSecret, discordBackend } = variables;

                if (discordSecret.trim().length < 1 || discordBackend.trim().length < 1) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing Discord Server Config!" });
                }

                // DO NOT USE THE QUANTITY SENT TO API, USE THE QUANTITY QUERIED FROM DB
                console.log(`** Checking if proper user ${userId} is claiming the reward **`);
                if (whiteListUser.userId !== userId) {
                    return res.status(200).json({
                        message: "Not authenticated to claim this reward.",
                        isError: true,
                    });
                }

                console.log(`** Assure this reward ${generatedURL} exists and not claimed **`);
                const pendingReward = await prisma.pendingReward.findUnique({
                    where: {
                        userId_rewardTypeId_generatedURL: {
                            userId: whiteListUser.userId,
                            rewardTypeId,
                            generatedURL,
                        },
                    },
                    include: {
                        rewardType: true,
                    },
                });

                if (!pendingReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Cannot find reward associated to user ${userId}, url ${generatedURL}, please contact administrator!`,
                    });
                }

                if (pendingReward.isClaimed) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward is claimed previously!`,
                    });
                }

                let claimReward = await updateClaimAndPendingRewardTransaction(
                    whiteListUser,
                    rewardTypeId,
                    pendingReward,
                    generatedURL
                );


                if (!claimReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${userId} or already claimed, please contact administrator!`,
                    });
                }

                // post to discord
                if (
                    whiteListUser.discordId != null &&
                    whiteListUser.discordId.trim().length > 0
                ) {
                    pendingReward.claimedUser = `<@${whiteListUser.discordId.trim()}>`;
                } else if (
                    whiteListUser.uathUser != null &&
                    whiteListUser.uathUser.trim().length > 0
                ) {
                    pendingReward.claimedUser = whiteListUser.uathUser;
                } else if (
                    whiteListUser.twitterUserName != null &&
                    whiteListUser.twitterUserName.trim().length > 0
                ) {
                    pendingReward.claimedUser = whiteListUser.twitterUserName;
                } else {
                    pendingReward.claimedUser = whiteListUser.userId;
                }
                pendingReward.imageUrl = pendingReward.rewardType.rewardPreview;

                let discordPost = await axios
                    .post(
                        `${discordBackend}/api/v1/channels/claimedReward`,
                        {
                            pendingReward,
                        },
                        {
                            headers: {
                                Authorization: `Bot ${discordSecret}`,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .catch((err) => {
                        res.status(200).json({ isError: true, message: err.message });
                        return
                    });

                res.status(200).json(pendingReward);

            } catch (err) {
                return res.status(200).json({ isError: true, message: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(userClaimRewardAPI);
