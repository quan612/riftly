import adminMiddleware from "@middlewares/adminMiddleware";
import withExceptionFilter from "@middlewares/withExceptionFilter";
import { prisma } from "context/PrismaContext";

const AdminUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { chunk, rewardTypeId, quantity } = req.body;
            try {

                let count = 0;
                const trackers = await Promise.all(
                    chunk.map(({ userId }) => {
                        count++;
                        return prisma.reward.upsert({
                            where: {
                                userId_rewardTypeId: { userId, rewardTypeId }
                            },
                            update: {
                                quantity: {
                                    increment: parseInt(quantity),
                                },
                            },
                            create: {
                                quantity,
                                rewardType: {
                                    connect: {
                                        id: parseInt(rewardTypeId),
                                    },
                                },
                                user: {
                                    connect: {
                                        userId,
                                    },
                                },
                            },
                        });
                    }))

                res.status(200).json({ message: "Ok" });
            } catch (error) {
                //     return res.status(200).json({ isError: true, message: error.message });
                throw new Error(`Catch error reward users from chunk ${chunk[0].wallet} to ${chunk[chunk.length - 1].wallet}`)
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default withExceptionFilter(adminMiddleware(AdminUserAddAPI));
