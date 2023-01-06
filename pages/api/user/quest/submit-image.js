import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";

const { NODEJS_SECRET, DISCORD_NODEJS } = process.env;

const submitImageQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Challenger is not enabled." });
                }
                const whiteListUser = req.whiteListUser;
                const { questId, rewardTypeId, extendedQuestData, imageUrl } = req.body;
                let userQuest;

                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId,
                    },
                    include: {
                        type: true,
                    },
                });

                if (currentQuest.type.name !== Enums.IMAGE_UPLOAD_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is only for image-upload quest!",
                    });
                }

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        userID_questId: { userId: whiteListUser.userId, questId },
                    },
                });
                if (entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "This quest already submitted before!" });
                }

                let extendedUserQuestData = {
                    ...extendedQuestData,
                    imageUrl,
                };

                userQuest = await submitNewUserImageQuestTransaction(
                    questId,
                    rewardTypeId,
                    currentQuest.quantity,
                    extendedUserQuestData,
                    whiteListUser
                );
                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "User Quest cannot be submitted!" });
                }

                return res.status(200).json(userQuest);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(submitImageQuestAPI);

const submitNewUserImageQuestTransaction = async (
    questId,
    rewardTypeId,
    quantity,
    extendedUserQuestData,
    whiteListUser
) => {
    let claimedReward;

    console.log(`**Create / Update reward for user**`);
    const { userId } = whiteListUser;
    claimedReward = prisma.reward.upsert({
        where: {
            userId_rewardTypeId: { userId, rewardTypeId },
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        create: {
            userId,
            quantity,
            rewardTypeId,
        },

        select: {
            userId: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`**Save to UserQuest, to keep track that its done**`);
    let userQuest = prisma.userQuest.create({
        data: {
            userId,
            questId,
            rewardedTypeId: rewardTypeId,
            rewardedQty: quantity,
            extendedUserQuestData,
        },
    });

    await prisma.$transaction([claimedReward, userQuest]);

    return userQuest;
};
