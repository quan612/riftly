import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminUserQuestDeleteAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { id, userId, questId } = req.body;

        let existingUserQuest = await prisma.userQuest.findUnique({
          where: {
            userId_questId: { userId, questId },
          },
        });

        if (!existingUserQuest) {
          res.status(200).json({ isError: true, message: "User Quest not found for deletion." });
        }

        await prisma.userQuest.delete({
          where: {
            userId_questId: { userId, questId },
          },
        })

        res.status(200).json({ isError: false, message: "Update succeed." });
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default adminMiddleware(AdminUserQuestDeleteAPI);
