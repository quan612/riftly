import adminMiddleware from "@middlewares/adminMiddleware";
import { prisma } from "context/PrismaContext";

const AdminUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { usersArray } = req.body;

                const createMany = await prisma.whiteList.createMany({
                    data:
                        usersArray.map(user => {
                            return {
                                wallet: user.wallet
                            }
                        })
                    ,
                    skipDuplicates: true,
                });

                res.status(200).json(createMany);
            } catch (error) {
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(AdminUserAddAPI);
