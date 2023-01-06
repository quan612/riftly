import Enums from "enums";
import { getQuestById } from "repositories/quest";
import { prisma } from "@context/PrismaContext";

export default async function getQuestLeaderBoardAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { eventName } = req.query;
                if (!eventName) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing eventName query." });
                }


                let questType = await prisma.questType.findMany({});
                let imageQuest = questType.find(q => q.name === Enums.IMAGE_UPLOAD_QUEST)
                if (!imageQuest) {
                    throw new Error("Cannot find any quest of type image upload")
                }

                let allImageQuests = await prisma.quest.findMany({
                    where: {
                        questTypeId: imageQuest.id,
                    },
                });

                if (!allImageQuests) {
                    throw new Error("Cannot find image quests")
                }

                let currentImageQuest = allImageQuests.find(q => q.extendedQuestData.eventName.toLowerCase() === eventName.toLowerCase());
                let questData = await getQuestById(currentImageQuest.questId);

                if (!questData) {
                    return res.status(200).json({ isError: true, message: "Not a valid quest." });
                }

                if (questData.type.name !== Enums.IMAGE_UPLOAD_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: `No data for this type of quest ${questData.type}`,
                    });
                }

                res.status(200).json(questData);
            } catch (err) {

                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
