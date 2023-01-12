import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminDiscordChannelsQueryAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        let discordChannels = await prisma.discord.findMany({
          where: {
            isDeleted: false
          }
        });

        return res.status(200).json(discordChannels);
      } catch (err) {
        console.log(err);
        res.status(200).json({ isError: true, message: err.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default adminMiddleware(AdminDiscordChannelsQueryAPI);
