import adminMiddleware from "@middlewares/adminMiddleware";
import Enums from "enums";
import { prisma } from "context/PrismaContext";
import axios from "axios";
import { utils } from "ethers";

const AdminUserDeleteAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { userId } = req.body;

                let userQuery = await prisma.whiteList.findUnique({
                    where: { userId }
                })

                if (!userQuery) {
                    throw new Error("Non-existent user")
                }

                let deleteUserQuest = prisma.userQuest.deleteMany({ where: { userId } })
                let deleteUser = prisma.whiteList.delete({ where: { userId } })
                let smsVerifyDelete = prisma.whiteList.delete({ where: { userId } })

                await prisma.$transaction([deleteUserQuest, deleteUser, smsVerifyDelete]);

                return res.status(200).json({ message: "User deleted" });
            } catch (error) {
                console.log(error)
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(AdminUserDeleteAPI);
