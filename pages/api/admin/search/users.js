import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const adminSearchUserAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                // console.time()

                const { walletArray } = req.body

                let users = await prisma.whiteList.findMany({
                    where: {
                        wallet: { in: walletArray }
                    },
                });

                res.status(200).json(users);

            } catch (err) {
                console.log(err);
                res.status(200).json({ isError: true, message: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminSearchUserAPI);

export const config = {
    api: {
        responseLimit: '8mb',
    },
}
