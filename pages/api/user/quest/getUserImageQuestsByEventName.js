import adminMiddleware from "middlewares/adminMiddleware";
import Enums from "enums";
import { prisma } from "@context/PrismaContext";

const ITEM_PER_PAGE = Enums.ITEM_PER_PAGE;
const getUserImageQuestsByEventNameAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { eventName, page } = req.query;

                let questType = await prisma.questType.findMany({});
                let imageQuest = questType.find(q => q.name === Enums.IMAGE_UPLOAD_QUEST)
                if (!imageQuest) {
                    throw new Error("cannot find quest")
                }

                let allImageQuests = await prisma.quest.findMany({
                    where: {
                        questTypeId: imageQuest.id,
                    },
                });

                if (!allImageQuests) {
                    throw new Error("Cannot find image quests")
                }

                console.log(`** Get all user quests of id **`);
                let currentImageQuest = allImageQuests.find(q => q.extendedQuestData.eventName.toLowerCase() === eventName.toLowerCase());

                if (!currentImageQuest) {
                    throw new Error(`Cannot find image quest of this event name ${eventName}`)
                }


                let allUserQuestsOfThisQuestId = await prisma.userQuest.findMany({
                    where: {
                        questId: currentImageQuest.questId,
                        isHidden: false
                    },
                });

                let userQuests = await prisma.userQuest.findMany({
                    where: {
                        questId: currentImageQuest.questId,
                        isHidden: false
                    },
                    skip: page * ITEM_PER_PAGE,
                    take: ITEM_PER_PAGE,
                    // orderBy: [
                    //     {
                    //         updatedAt: "asc",
                    //     },
                    // ],
                    include: {
                        user: true,
                    },
                });

                /* filter userQuests with messageId*/

                return res.status(200).json({
                    isError: false,
                    data: userQuests,
                    count: allUserQuestsOfThisQuestId.length,
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(getUserImageQuestsByEventNameAPI);
