import adminMiddleware from "@middlewares/adminMiddleware";
import Enums from "enums";
import { prisma } from "context/PrismaContext";
import axios from "axios";
import { utils } from "ethers";
import { sleep } from "@util/index";
const Moralis = require("moralis").default;

const AdminUpdateUsersETHAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { selectedRows } = req.body;
                console.log("Refresh ETH")
                console.time()

                if (!Moralis.Core.isStarted) {
                    await Moralis.start({
                        apiKey: process.env.MORALIS_API_KEY,
                        // ...other configuration
                    });
                }

                // should be serial here
                for (let row of selectedRows) {
                    await sleep(100)
                    const { userId, wallet } = row

                    let response = await Moralis.EvmApi.balance.getNativeBalance({
                        address: wallet,
                        chain: 1,
                    }).then(r => r.toJSON());

                    let responseInEther = utils.formatEther(response.balance)
                    let eth = (+responseInEther).toFixed(2);

                    let lastEthUpdated = new Date(Date.now()).toISOString();

                    // console.log(eth)

                    await prisma.whiteListUserData.upsert({
                        where: {
                            userId
                        },
                        update: {
                            eth,
                            lastEthUpdated
                        },
                        create: {
                            eth,
                            lastEthUpdated,
                            user: {
                                connect: {
                                    userId
                                }
                            }
                        }
                    })

                }
                console.log("done update eth")
                console.timeEnd()
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
export default adminMiddleware(AdminUpdateUsersETHAPI);
