import { prisma } from "context/PrismaContext";

import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";

// should only return Id, not secret so we need to early exit in case someone tries to query one.
const UserConfigsQueryAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { type } = req.query;
        console.log(type)
        if (type !== "discordId" && type !== "twitterId") {
          return res.status(200).json({ isError: true, message: "Only for querying Id" });
        }
        let configs = await prisma.questVariables.findFirst();
        let configType = configs[type];

        return res.status(200).json(configType);
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default whitelistUserMiddleware(UserConfigsQueryAPI);
