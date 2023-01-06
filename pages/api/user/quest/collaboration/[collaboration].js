import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";

const collaborationQuestQueryAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { collaboration } = req.query;
                const whiteListUser = req.whiteListUser;
                console.log(`** Get all enabled quests for user **`);
                let availableQuests = await getAllEnableQuestsForUser();

                console.log(`** Get quests done by this user **`);
                let finishedQuest = await getQuestsDoneByThisUser(whiteListUser.userId);

                let quests = availableQuests.filter(q => {

                    // for now dont show code quest on collaboration
                    // if (q.type.name === Enums.CODE_QUEST) {
                    //     return false;
                    // }

                    if (// only get quest that has collaboration same as query uri
                        q.extendedQuestData.collaboration &&
                        q.extendedQuestData.collaboration.length > 0 &&
                        q.extendedQuestData.collaboration === collaboration
                    ) {
                        return true;
                    }

                    return false;
                }).map((aq) => {
                    let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId);
                    if (relatedQuest) {
                        aq.isDone = true;
                        aq.rewardedQty = relatedQuest.rewardedQty;

                    } else {
                        aq.isDone = false;
                        aq.rewardedQty = 0;
                    }
                    return aq
                })

                return res.status(200).json(quests);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default whitelistUserMiddleware(collaborationQuestQueryAPI);
