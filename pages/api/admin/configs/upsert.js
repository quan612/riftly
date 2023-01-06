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

        } = req.body;


        let env = process.env.VERCEL_ENV || "development";

        let upsertRes = await prisma.questVariables.upsert({
          where: {
            id: id || -1,
          },
          create: {
            discordId,
            discordSecret,
            discordBackend,
            discordBackendSecret,
            twitterId,
            twitterSecret,
            vercel_env: env,
          },
          update: {
            discordId,
            discordSecret,
            discordBackend,
            discordBackendSecret,
            twitterId,
            twitterSecret,
          },
        });

        res.status(200).json({ isError: false, message: "Update succeed." });
      } catch (err) {

        res.status(500).json({ isError: true, message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default adminMiddleware(AdminConfigsUpsertAPI);
