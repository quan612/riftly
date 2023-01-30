import Enums from "@enums/index";
import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const adminSearchAPI = async (req, res) => {
    const { method } = req;
    const currentPage = req.query.page;

    switch (method) {
        case "POST":
            let searchRes = {}, userCondition = {};

            try {
                // console.time()
                const userCount = await prisma.whiteList.count();
                let users = await prisma.whiteList.findMany({
                    // where: userCondition,
                    skip: currentPage * 10000,
                    take: 10000,
                    orderBy: [
                        {
                            createdAt: "asc",
                        },
                    ],
                    select: {
                        userId: true,
                        wallet: true,
                        twitterUserName: true,
                        discordUserDiscriminator: true,
                        rewards: {
                            where: {
                                rewardType: {
                                    isEnabled: true
                                }
                            },
                            select: {
                                quantity: true,
                                rewardType: true,
                            },
                        },
                    },
                });

                let rewardTypes = await prisma.rewardType.findMany({
                    where: {
                        isEnabled: true
                    }
                })

                // console.log(rewardTypes)

                // let usersOp = users.map((user, i) => {
                //     rewardTypes.map((r) => {
                //         let rewardIndex = user.rewards.findIndex(userReward => userReward.rewardType.id === r.id)
                //         // console.log(found)

                //         if (rewardIndex === -1) {
                //             user[r.reward] = 0;
                //         } else {
                //             user[r.reward] = user.rewards[rewardIndex].quantity;
                //         }
                //     })
                //     return users
                // })

                // await Promise.all(usersOp)
                // users.forEach((user, i) => {
                //     rewardTypes.forEach((r) => {
                //         let found = user.rewards.some(userReward => userReward.rewardType.id === r.id)
                //         // console.log(found)

                //         if (!found) {
                //             user[r.reward] = 0;
                //         } else {
                //             user[r.reward] = 1;
                //             // user[r.reward] = user.rewards[indexOfReward].quantity
                //         }
                //     })
                //     // return users

                // })
                for (let i = 0; i < users.length; i++) {
                    // Do stuff with arr[i] or i
                    rewardTypes.map((r) => {
                        let user = users[i];
                        let rewardIndex = user.rewards.findIndex(userReward => userReward.rewardType.id === r.id)

                        if (rewardIndex === -1) {
                            user[r.reward] = 0;
                        } else {
                            user[r.reward] = user.rewards[rewardIndex].quantity
                        }
                    })
                }

                // console.log(users[0])
                searchRes.userCount = userCount;
                searchRes.users = users;

                if (currentPage * 10000 >= userCount) {
                    searchRes.shouldContinue = false;
                } else {
                    searchRes.shouldContinue = true;
                }

                res.setHeader('Cache-Control', 'max-age=0, s-maxage=300, stale-while-revalidate');
                // console.timeEnd()

                res.status(200).json(searchRes);

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

export default adminMiddleware(adminSearchAPI);

export const config = {
    api: {
        responseLimit: '8mb',
    },
}
