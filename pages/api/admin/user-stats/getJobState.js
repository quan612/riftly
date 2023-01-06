import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const adminGetJobStateAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            let jobId = "Update Moralis Nft Owners"

            try {
                let jobState = await prisma.bullJob.findUnique({
                    where: {
                        jobId
                    },
                })
                return res.status(200).json(jobState);

            } catch (err) {
                console.log(err.message)
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminGetJobStateAPI);
