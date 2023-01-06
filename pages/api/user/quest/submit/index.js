import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import {
    submitUserQuestTransaction,
    submitUserDailyQuestTransaction,
} from "repositories/transactions";

function sleep(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}

//General user quest submit
const submitIndividualQuestAPI = async (req, res) => {
    const { method } = req;

    if (process.env.NODE_ENV === "production") {
        console.log("In production, throttle the request");
        // await sleep();
    }

    switch (method) {
        case "POST":
            if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                return res
                    .status(200)
                    .json({ isError: true, message: "Challenger is not enabled." });
            }

            const whiteListUser = req.whiteListUser;
            const { questId, rewardTypeId, quantity, extendedQuestData } = req.body;
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

                if (
                    currentQuest.type.name === Enums.IMAGE_UPLOAD_QUEST ||
                    currentQuest.type.name === Enums.CODE_QUEST ||
                    currentQuest.type.name === Enums.OWNING_NFT_CLAIM ||
                    currentQuest.type.name === Enums.UNSTOPPABLE_AUTH
                ) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is only for general quest!",
                    });
                }

                if (currentQuest.type.name === Enums.DAILY_SHELL) {
                    console.log(`**In daily shell**`);

                    let entry = await prisma.UserQuest.findUnique({
                        where: {
                            userId_questId: { userId: whiteListUser.userId, questId },
                        },
                    });
                    if (entry) {
                        let oldDate = entry.extendedUserQuestData?.date || entry.updatedAt;
                        let [today] = new Date().toISOString().split("T");
                        if (today <= oldDate) {
                            return res.status(200).json({
                                isError: true,
                                message: "This quest already submitted before!",
                            });
                        }
                    }

                    let extendedUserQuestData = { ...extendedQuestData };
                    if (
                        extendedUserQuestData.frequently &&
                        extendedUserQuestData.frequently === "daily"
                    ) {
                        const [withoutTime] = new Date().toISOString().split("T");
                        extendedUserQuestData.date = withoutTime;
                    }

                    let currentQuest = await prisma.quest.findUnique({
                        where: {
                            questId,
                        },
                    });

                    userQuest = await submitUserDailyQuestTransaction(
                        questId,
                        currentQuest.type,
                        rewardTypeId,
                        currentQuest.quantity,
                        extendedUserQuestData,
                        whiteListUser
                    );
                    if (!userQuest) {
                        return res.status(200).json({
                            isError: true,
                            message: "User Quest cannot be submitted!",
                        });
                    }

                    return res.status(200).json(userQuest);
                } else {
                    /* Rest of other quest */
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
                    } else {
                        await submitUserQuestTransaction(questId, rewardTypeId, whiteListUser);
                    }

                    return res.status(200).json(userQuest);
                }
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

export default whitelistUserMiddleware(submitIndividualQuestAPI);
