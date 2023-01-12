import { prisma } from "context/PrismaContext";
import Enums from "enums";
import { questUpsert } from "repositories/quest";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminConfigsUpsertAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const {
          id,
          discordId,
          discordSecret,
          discordBackend,
          discordBackendSecret,
          twitterId,
          twitterSecret,
          pendingRewardImageUrl,
          cloudinaryName,
          cloudinaryKey,
          cloudinarySecret,
          hostUrl,
          discordBotToken,
        } = req.body;


        let env = process.env.VERCEL_ENV || "development";

        let upsertRes = await prisma.questVariables.upsert({
          where: {
            id: id || -1,
          },
          create: {
            vercel_env: env,
            hostUrl,
            discordBotToken,
            discordId,
            discordSecret,
            discordBackend,
            discordBackendSecret,
            twitterId,
            twitterSecret,
            pendingRewardImageUrl,
            cloudinaryName,
            cloudinaryKey,
            cloudinarySecret,
          },
          update: {
            hostUrl,
            discordBotToken,
            discordId,
            discordSecret,
            discordBackend,
            discordBackendSecret,
            twitterId,
            twitterSecret,
            pendingRewardImageUrl,
            cloudinaryName,
            cloudinaryKey,
            cloudinarySecret,
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

export default adminMiddleware(AdminConfigsUpsertAPI);
