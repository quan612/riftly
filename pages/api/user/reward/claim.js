import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";
import { updateClaimAndPendingRewardTransaction } from "repositories/transactions";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;

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



                //post to discord if discordId exists
                if (claimReward) {
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

                    switch (pendingReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Mintlist-Reward.gif`;
                            break;
                        case Enums.REWARDTYPE.SHELL:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif`;
                            break;
                        default:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif`;
                            break;
                    }

                    let discordPost = await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/claimedReward`,
                            {
                                pendingReward,
                            },
                            {
                                //authorization
                                headers: {
                                    Authorization: `Bot ${NODEJS_SECRET}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .catch((err) => {
                            // console.log(err);
                            res.status(200).json({ isError: true, message: err.message });
                            return
                        });
                }
                res.status(200).json(pendingReward);

                // res.status(200).json({ message: "ok" });
            } catch (err) {
                // console.log(err);
                return res.status(200).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(userClaimRewardAPI);
