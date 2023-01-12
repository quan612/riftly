import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminRewardTypePostAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { id, reward, rewardPreview, rewardIcon, isUpdating, isEnabled } = req.body;

        if (!isUpdating) {
          let existingReward = await prisma.rewardType.findUnique({
            where: {
              reward,
            },
          });

          if (existingReward) {
            return res.status(200).json({
              message: `Cannot add more than one reward: "${reward}".`,
              isError: true,
            });
          }
        }

        let upsertRes = await prisma.rewardType.upsert({
          where: {
            id: id || -1,
          },
          create: {
            reward,
            rewardPreview,
            rewardIcon,
            isEnabled,
          },
          update: {
            reward,
            rewardPreview,
            rewardIcon,
            isEnabled,
          },
        });

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

export default adminMiddleware(AdminRewardTypePostAPI);
