import Enums from "@enums/index";
import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminUserQuestQueryAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { user, type } = req.body;

        let userCondition = {};

        switch (type) {
          case Enums.WALLET:
            userCondition = { wallet: user };
            break;
          case Enums.DISCORD:
            userCondition = { discordUserDiscriminator: user };
            break;
          case Enums.TWITTER:
            userCondition = { twitterUserName: user };
            break;
          default:
            userCondition = { wallet: user };
            break;
        }
        let whiteListUser = await prisma.whiteList.findUnique({
          where: userCondition,
          include: {
            userQuest: {
              include: {
                quest: true,
                rewardType: true
              }
            }
          }
        });

        res.status(200).json(whiteListUser);
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

export default adminMiddleware(AdminUserQuestQueryAPI);
