import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminDiscordChannelsPostAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { id, channel, channelId } = req.body;

        if (existingCollaboration) {
          return res.status(200).json({
            message: `Cannot add more than one "${type}" type of quest for same collaboration "${extendedQuestData.collaboration}".`,
            isError: true,
          });
        }

        let newChannel = await prisma.discord.create(

          {
            data: {
              channel,
              channelId,
              isEnabled,
              isDeleted,
            },
          }
        );

        res.status(200).json({ isError: false, message: "Update succeed." });
      } catch (err) {
        res.status(200).json({ isError: true, message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default adminMiddleware(AdminDiscordChannelsPostAPI);
