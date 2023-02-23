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
                console.log("Refresh stats")
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
                let eth = (+responseInEther).toFixed(4);

                let data = {}
                let followers_count = 0

                if (userQuery?.twitterId?.length > 5) {
                    let twitterUserMetric = await axios
                        .get(`https://api.twitter.com/2/users/${userQuery.twitterId}?user.fields=public_metrics`,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                                    "Content-Type": "application/json",
                                },
                            }).then(r => r.data)
                        .catch(function (error) {
                            console.log(error);
                        });

                    if (twitterUserMetric.hasOwnProperty("errors")) {
                        console.log(`found suspended account ${userQuery.twitterUserName}`)
                    }

                    if (twitterUserMetric.data?.hasOwnProperty("public_metrics")) {
                        followers_count = twitterUserMetric.data.public_metrics.followers_count;
                    }
                }

                data.eth = eth
                data.followers_count = followers_count

                // console.log(data)

                await prisma.whiteListUserData.upsert({
                    where: {
                        userId
                    },
                    update: {
                        data
                    },
                    create: {
                        data,
                        user: {
                            connect: {
                                userId
                            }
                        }
                    }
                })
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
