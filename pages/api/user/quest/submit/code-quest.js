import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";

const submitCodeQuest = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { userId } = req.whiteListUser;
            const { questId, inputCode } = req.body;
            let userQuest;
            try {
                if (!inputCode) {
                    return res.status(200).json({
                        isError: true,
                        message: "Missing input!",
                    });
                }

                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId,
                    },
                    include: {
                        type: true,
                    },
                });

                const { type, extendedQuestData } = currentQuest;

                if (type.name !== Enums.CODE_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is for code quest!",
                    });
                }

                let foundOtherAnswersCorrect = -1;

                if (extendedQuestData.hasOwnProperty("otherAnswers")) {
                    let { otherAnswers } = extendedQuestData;
                    let answersArray = otherAnswers.split(",");

                    foundOtherAnswersCorrect = answersArray.findIndex((element) => {
                        return (
                            element.trimStart().trimEnd().toLowerCase() ===
                            inputCode.trimStart().trimEnd().toLowerCase()
                        );
                    });
                }

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        userId_questId: { userId, questId },
                    },
                });

                let extendedUserQuestData = {};

                if (entry) {
                    extendedUserQuestData = { ...entry.extendedUserQuestData, count: entry.extendedUserQuestData.count + 1 };
                } else {
                    extendedUserQuestData.count = 1
                }

                extendedUserQuestData.lastSubmitted = new Date().toISOString().replace('T', " ").replace("Z", "")
                // either matching secret code, or similar answers
                if (
                    inputCode.toLowerCase() === extendedQuestData.secretCode.toLowerCase() ||
                    foundOtherAnswersCorrect !== -1
                ) {

                    userQuest = await prisma.UserQuest.upsert({
                        where: {
                            userId_questId: { userId, questId },
                        },
                        update: {
                            isClaimable: true,
                            extendedUserQuestData
                        },
                        create: {
                            userId,
                            questId,
                            isClaimable: true,
                            extendedUserQuestData
                        },
                    });
                    return res.status(200).json(userQuest);
                } else {
                    // update count wrong submission

                    userQuest = await prisma.UserQuest.upsert({
                        where: {
                            userId_questId: { userId, questId },
                        },
                        update: {
                            extendedUserQuestData
                        },
                        create: {
                            userId,
                            questId,
                            extendedUserQuestData
                        },
                    });


                    // if (entry) {

                    //     await prisma.UserQuest.update({
                    //         where: {
                    //             userId_questId: { userId, questId },
                    //         },

                    //         data: {
                    //             extendedUserQuestData,
                    //         },
                    //     });
                    // } else {
                    //     await prisma.UserQuest.create({
                    //         data: {
                    //             userId,
                    //             questId,
                    //             extendedUserQuestData: {
                    //                 count: 1,
                    //             },
                    //         },
                    //     });
                    // }
                    return res.status(200).json({ isError: true, message: "Wrong code submitted" });
                }
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message, questId });
            }
            break;
        default:
            res.setHeader("Allow", ["PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(submitCodeQuest);
