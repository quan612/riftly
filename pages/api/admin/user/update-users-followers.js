import adminMiddleware from "@middlewares/adminMiddleware";
import Enums from "enums";
import { prisma } from "context/PrismaContext";
import { utils } from "ethers";
import axios from "axios";
import { sleep } from "@util/index";

const AdminUpdateUsersFollowersAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { selectedRows } = req.body;
                console.log("update user followers")

                for (let row of selectedRows) {
                    await sleep(100)
                    const { userId, twitterId } = row

                    let followers = 0;
                    if (twitterId?.length > 5) {
                        let twitterUserMetric = await axios
                            .get(`https://api.twitter.com/2/users/${twitterId}?user.fields=public_metrics`,
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
                            console.log(`found suspended account ${twitterId}`)
                        }

                        if (twitterUserMetric.data?.hasOwnProperty("public_metrics")) {
                            followers = twitterUserMetric.data.public_metrics.followers_count;
                        }
                    }

                    let lastFollowersUpdated = new Date(Date.now()).toISOString();
                    await prisma.whiteListUserData.upsert({
                        where: {
                            userId
                        },
                        update: {
                            followers,
                            lastFollowersUpdated
                        },
                        create: {
                            followers,
                            lastFollowersUpdated,
                            user: {
                                connect: {
                                    userId
                                }
                            }
                        }
                    })
                }

                return res.status(200).json({ message: "Followers refresh" });
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
export default adminMiddleware(AdminUpdateUsersFollowersAPI);
