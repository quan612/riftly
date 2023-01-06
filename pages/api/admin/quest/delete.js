import { prisma } from "context/PrismaContext";
import Enums from "enums";

import adminMiddleware from "middlewares/adminMiddleware";

const ROUTE = "/api/admin/quest/delete";
const AdminQuestDeleteAPI = async (req, res) => {
    const { method } = req;

    switch (method) {

        case "POST":
            try {
                const {
                    id,
                    type,
                    description,
                    text,
                    completedText,
                    rewardTypeId,
                    quantity,
                    isEnabled,
                    isRequired,
                    extendedQuestData,
                } = req.body;

                let updatedQuest = await prisma.quest.update({
                    where: {
                        id,
                    },
                    data: {
                        isDeleted: true,
                    },
                });

                res.status(200).json(updatedQuest);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(AdminQuestDeleteAPI);
