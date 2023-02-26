import { prisma } from "context/PrismaContext";

const requiredSMSAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        let allConfigs = await prisma.questVariables.findFirst();
        let requiredSmsVerification = allConfigs.requiredSmsVerification

        return res.status(200).json(requiredSmsVerification);
      } catch (err) {
        console.log(err);
        res.status(500).json({ isError: true, message: err.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default requiredSMSAPI;
