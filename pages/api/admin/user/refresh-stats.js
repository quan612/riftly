import adminMiddleware from "@middlewares/adminMiddleware";
import Enums from "enums";
import { prisma } from "context/PrismaContext";
import axios from "axios";
import { utils } from "ethers";
const Moralis = require("moralis").default;

const AdminUserRefreshStatAPI = async (req, res) => {
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

                if (!Moralis.Core.isStarted) {
                    await Moralis.start({
                        apiKey: process.env.MORALIS_API_KEY,
                        // ...other configuration
                    });
                }

                let response = await Moralis.EvmApi.balance.getNativeBalance({
                    address: userQuery.wallet,
                    chain: 1,
                }).then(r => r.toJSON());

                let responseInEther = utils.formatEther(response.balance)

                let balance = (+responseInEther).toFixed(4);

                console.log(balance)

                return res.status(200).json({ message: "Stats refresh" });
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
export default adminMiddleware(AdminUserRefreshStatAPI);
