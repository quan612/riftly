import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";

const SHELL_PRICE = Enums.SHELL_PRICE;
const MAX_ROLL_REDEEM = Enums.MAX_ROLL_REDEEM;
const shellRedeemRollAllAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;

                if (process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "false") {
                    return res.status(200).json({ isError: true, message: "shell redeem is not enabled." });
                }

                // DO NOT USE THE QUANTITY SENT TO API, USE THE QUANTITY QUERIED FROM DB

                /* 
                    1. Check if redeem? if redeemed, return
                    2. 
                    3. Query current shell quantity
                    4. If shell < 2000, then returned
                    5. Calculate how many rewards user can get based on shell
                    
                    6.
                        a. if claimableRewards <= userShellRedeem.rewardArray

                        b. if claimableRewards > userShellRedeem.rewardArray
                */
                let userId = whiteListUser.userId
                console.log(`** Assure this reward exists and not redeemed **`);
                let userShellRedeem = await prisma.shellRedeemed.findUnique({
                    where: {
                        userId
                    }
                })
                if (userShellRedeem?.isRedeemed) {
                    res.status(200).json({ message: "Already redeemed", isError: true });
                }

                if (!userShellRedeem) {
                    let rewards = [Enums.BOOTS, Enums.ANOMURA_DOWNLOADABLE_STUFFS, Enums.ANOMURA_PFP]
                    await prisma.shellRedeemed.create({
                        data: {
                            isRedeemed: false,
                            rewardPointer: -1,
                            rewards,
                            userId
                        },
                    });
                }

                let shellReward = await prisma.rewardType.findFirst({
                    where: {
                        reward: "$Shell"
                    }
                })
                let rewardTypeId = shellReward.id
                let userReward = await prisma.reward.findUnique({
                    where: {
                        userId_rewardTypeId: { userId, rewardTypeId },
                    },
                })

                //handle shell less than min roll price
                if (!userReward || userReward.quantity < SHELL_PRICE) {
                    console.log("inside less than min roll price")
                    let updateShellRedeemed = await redeemRewardForAccountLessThanMinimumRollPrice(userId, rewardTypeId)
                    return res.status(200).json(updateShellRedeemed);
                }
                else {
                    let claimableRewards = Math.floor(userReward.quantity / SHELL_PRICE)

                    // maximum rollable to be less than config number
                    if (claimableRewards > MAX_ROLL_REDEEM) {
                        claimableRewards = MAX_ROLL_REDEEM
                    }

                    let reduceShellQty = claimableRewards * SHELL_PRICE;

                    let updateShellRedeemed;

                    updateShellRedeemed = await redeemReward(claimableRewards, reduceShellQty, userId, rewardTypeId)
                    updateShellRedeemed.rewards = updateShellRedeemed.rewards.splice(0, updateShellRedeemed.rewardPointer + 1)
                    res.status(200).json(updateShellRedeemed);
                }
                // res.status(200).json({ message: "ok" });

            } catch (err) {
                console.log(err)
                res.status(500).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(shellRedeemRollAllAPI);


const redeemReward = async (
    claimableRewards,
    reduceShellQty,
    userId,
    rewardTypeId
) => {

    try {
        console.log(`**Update Reward for User Redeem**`);
        // let updateUserReward = prisma.reward.update({
        //     where: {
        //         userId_rewardTypeId: { userId, rewardTypeId },
        //     },
        //     data: {
        //         quantity: {
        //             decrement: reduceShellQty,
        //         },
        //     },
        // });

        console.log(`**Update ShellRedeem table**`);
        let updateShellRedeemed = prisma.shellRedeemed.update({
            where: {
                userId,
            },
            data: {
                isRedeemed: false,
                rewardPointer: claimableRewards - 1
            },
        });

        // await prisma.$transaction([updateUserReward, updateShellRedeemed]);
        await prisma.$transaction([updateShellRedeemed]);
        return updateShellRedeemed;
    } catch (error) {
        console.log(error);
    }
};

const redeemRewardForAccountLessThanMinimumRollPrice = async (
    userId,
    rewardTypeId
) => {

    try {
        console.log(`**Update Reward for User Redeem**`);
        // update shell to 0
        // let updateUserReward = prisma.reward.update({
        //     where: {
        //         userId_rewardTypeId: { userId, rewardTypeId },
        //     },
        //     data: {
        //         quantity: 0,
        //     },
        // });

        console.log(`**Update ShellRedeem table**`);

        // let oneOrZero = (Math.random() > 0.5) ? 1 : 0
        // let reward = oneOrZero === 1 ? Enums.BOOTS : Enums.ANOMURA_DOWNLOADABLE_STUFFS
        let reward;
        let random = Math.random()
        if (random > 0.1) {
            reward = Enums.OCTOHEDZ_RELOADED
        }
        if (random > 0.2) {
            reward = Enums.COLORMONSTER_NFT
        }
        if (random > 0.3) {
            reward = Enums.MIRAKAI_SCROLLS_NFT
        }
        if (random > 0.4) {
            reward = Enums.ETHER_JUMP_NFT
        }
        if (random > 0.5) {
            reward = Enums.FREE_MINT
        }
        if (random > 0.6) {
            reward = Enums.ADOPT_ANIMAL
        }
        if (random > 0.7) {
            reward = Enums.GIFT_MINT_LIST_SPOT
        }
        if (random > 0.8) {
            reward = Enums.ZEN_ACADEMY_NFT
        }
        if (random > 0.9) {
            reward = Enums.MINT_LIST_SPOT
        }

        let updateShellRedeemed = prisma.shellRedeemed.upsert({
            where: {
                userId,
            },
            create: {
                rewards: [reward],
                isRedeemed: false,
                rewardPointer: 0
            },
            update: {
                rewards: [reward],
                isRedeemed: false,
                rewardPointer: 0
            }
        });

        // await prisma.$transaction([updateUserReward, updateShellRedeemed]);
        await prisma.$transaction([updateShellRedeemed]);
        return updateShellRedeemed;
    } catch (error) {
        console.log(error);
    }
};
