import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminDiscordChannelsPostAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { id, channel, channelId, isEnabled, isDeleted, isCreated } = req.body;

        if (isCreated) {
          let existingChannelId = await prisma.discord.findUnique({
            where: {
              channelId,
            },
          });

          if (existingChannelId && !existingChannelId.isDeleted) {
            return res.status(200).json({
              message: `Cannot add more than one channel Id: "${channelId}".`,
              isError: true,
            });
          }
        }

        let upsertRes = await prisma.discord.upsert({
          where: {
            id: id || -1,
          },
          create: {
            channel,
            channelId,
            isEnabled: true,
            isDeleted: false,
          },
          update: {
            // channel,
            // channelId,
            isEnabled,
            isDeleted,
          },
        });

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
