import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const AdminRequiredSMSAPI = async (req, res) => {
  const { method } = req;

  switch (method) {


    case "POST":
      try {
        let { id, isEnabled } = req.body;

        await prisma.questVariables.findFirst();

        let upsertRes = await prisma.questVariables.update({
          where: {
            id,
          },
          data: {
            requiredSmsVerification: isEnabled,
          },
        })

        return res.status(200).json(upsertRes);
      } catch (err) {
        console.log(err);
        res.status(500).json({ isError: true, message: err.message });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default adminMiddleware(AdminRequiredSMSAPI);
