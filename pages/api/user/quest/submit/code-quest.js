import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import {
    submitUserQuestTransaction,
    submitUserDailyQuestTransaction,
} from "repositories/transactions";

//General user quest submit
const submitCodeQuest = async (req, res) => {
    const { method } = req;



    switch (method) {
        case "POST":
            console.log("In Code Quest Submit");
            if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                return res
                    .status(200)
                    .json({ isError: true, message: "Challenger is not enabled." });
            }

            const whiteListUser = req.whiteListUser;
            const { questId, rewardTypeId, quantity, extendedQuestData, inputCode } = req.body;
            let userQuest;
            try {
                if (!inputCode) {
                    return res.status(200).json({
                        isError: true,
                        message: "Missing input!",
                    });
                }

                // query the type based on questId
                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId,
                    },
                    include: {
                        type: true,
                    },
                });

                /** This route is not for image upload quest */
                if (currentQuest.type.name !== Enums.CODE_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is for code quest!",
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

                // trying to find other answers as well
                let foundOtherAnswersCorrect = -1;
                let thisCodeQuest = await prisma.quest.findFirst({
                    where: {
                        questId
                    }
                })

                if (!thisCodeQuest) {
                    return res.status(200).json({
                        isError: true,
                        message: "This quest not existed!",
                    });
                }

                if (thisCodeQuest?.extendedQuestData.hasOwnProperty("otherAnswers")) {
                    let { otherAnswers } = thisCodeQuest?.extendedQuestData;
                    let answersArray = otherAnswers.split(",");

                    foundOtherAnswersCorrect = answersArray.findIndex((element) => {
                        return (
                            element.trimStart().trimEnd().toLowerCase() ===
                            inputCode.trimStart().trimEnd().toLowerCase()
                        );
                    });
                }

                // either matching secret code, or similar answers
                if (
                    inputCode.toLowerCase() ===
                    thisCodeQuest?.extendedQuestData.secretCode.toLowerCase() ||
                    foundOtherAnswersCorrect !== -1
                ) {
                    await submitUserQuestTransaction(questId, rewardTypeId, whiteListUser);
                    return res.status(200).json(userQuest);
                }
                else {
                    return res.status(200).json({ isError: true, message: "Wrong code submitted" });
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

export default whitelistUserMiddleware(submitCodeQuest);
