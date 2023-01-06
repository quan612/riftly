import { prisma } from "@context/PrismaContext";
import adminMiddleware from "@middlewares/adminMiddleware";
const ROUTE = "/api/admin/user/add";

const whitelistUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                console.log(`**Add New User**`);
                const { wallet } = req.body;

                let existingUser = await prisma.whiteList.findUnique({ where: { wallet } })
                if (existingUser) {
                    return res.status(200).json(existingUser);
                }

                else {
                    const user = await prisma.whiteList.create({
                        data: {
                            wallet
                        },
                    });

                    res.status(200).json(user);
                }

            } catch (error) {

                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(whitelistUserAddAPI);
