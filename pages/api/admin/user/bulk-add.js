import { WALLET } from "@enums/index";
import adminMiddleware from "@middlewares/adminMiddleware";
import { prisma } from "context/PrismaContext";
import { getAccountStatusToAdd } from "repositories/user";

const AdminUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { usersArray } = req.body;
                let accountStatus = await getAccountStatusToAdd();
                const createMany = await prisma.whiteList.createMany({
                    data:
                        usersArray.map(user => {
                            return {
                                wallet: user.wallet,
                                status: accountStatus,
                                signUpOrigin: WALLET
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
