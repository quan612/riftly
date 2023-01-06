import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const hideUserQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { questId, user } = req.body;

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        userId_questId: { userId: user.userId, questId },
                    },
                });
                if (!entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find this user quest!" });
                }

                await prisma.UserQuest.update({
                    where: {
                        userId_questId: { userId: user.userId, questId },
                    },
                    data: {
                        isHidden: true,
                    },
                })

                return res.status(200).json({ message: "ok!" });
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

export default adminMiddleware(hideUserQuestAPI);

