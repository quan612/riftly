import { prisma } from "context/PrismaContext";

export const updateTwitterUserAndAddRewardTransaction = async (quest, whiteListUser, userInfo) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;

    console.log(`**Update user**`);
    const { id, username } = userInfo;

    if (!id || !username) {
        throw new Error("Cannot get twitter id or twitter username from auth");
    }

    let currentQuest = await prisma.quest.findUnique({
        where: {
            questId,
        },
    });

    if (whiteListUser) {
        let { userId } = whiteListUser;
        let updatedUser = prisma.whiteList.update({
            where: { userId },
            data: {
                twitterId: id,
                twitterUserName: username,
            },
        });
        console.log(`**Create / Update reward for user**`);
        let claimedReward = prisma.reward.upsert({
            where: {
                userId_rewardTypeId: { userId, rewardTypeId },
            },
            update: {
                quantity: {
                    increment: currentQuest.quantity,
                },
            },
            create: {
                userId,
                quantity,
                rewardTypeId,
            },

            select: {
                userId: true,
                quantity: true,
                user: true,
                rewardTypeId: true,
                rewardType: true,
            },
        });

        console.log(`**Save Twitter Quest, to keep track that its done**`);
        let userQuest = prisma.userQuest.create({
            data: {
                userId,
                questId,
                rewardedTypeId: rewardTypeId,
                rewardedQty: currentQuest.quantity,
            },
        });
        try {
            await prisma.$transaction([updatedUser, claimedReward, userQuest]);
        } catch (error) {
            throw error;
        }
    } else {
        let newUser = await prisma.whiteList.create({
            data: {
                twitterId: id,
                twitterUserName: username,
            },
        });

        if (newUser) {
            let claimedReward = prisma.reward.upsert({
                where: {
                    userId_rewardTypeId: { userId: newUser.userId, rewardTypeId },
                },
                update: {
                    quantity: {
                        increment: currentQuest.quantity,
                    },
                },
                create: {
                    userId: newUser.userId,
                    quantity,
                    rewardTypeId,
                },

                select: {
                    userId: true,
                    quantity: true,
                    user: true,
                    rewardTypeId: true,
                    rewardType: true,
                },
            });

            console.log(`**Save Twitter Quest, to keep track that its done**`);
            let userQuest = prisma.userQuest.create({
                data: {
                    userId: newUser.userId,
                    questId,
                    rewardedTypeId: rewardTypeId,
                    rewardedQty: currentQuest.quantity,
                },
            });
            try {
                await prisma.$transaction([claimedReward, userQuest]);
            } catch (error) {
                // doing nothing, user can still do the quest later
            }
        }
    }
};

export const updateDiscordUserAndAddRewardTransaction = async (quest, whiteListUser, userInfo) => {
    console.log(`**Update user discord**`);
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;
    const { id, username, discriminator } = userInfo;

    let currentQuest = await prisma.quest.findUnique({
        where: {
            questId,
        },
    });

    if (whiteListUser) {
        const { userId } = whiteListUser;

        let updatedUser = prisma.whiteList.update({
            where: { userId },
            data: {
                discordId: id,
                discordUserDiscriminator: `${username}#${discriminator}`,
            },
        });

        console.log(`**Create / Update reward for user**`);
        let claimedReward = prisma.reward.upsert({
            where: {
                userId_rewardTypeId: { userId, rewardTypeId },
            },
            update: {
                quantity: {
                    increment: currentQuest.quantity,
                },
            },
            create: {
                userId,
                quantity,
                rewardTypeId,
            },

            select: {
                userId: true,
                quantity: true,
                user: true,
                rewardTypeId: true,
                rewardType: true,
            },
        });

        console.log(`**Save to UserQuest, to keep track that its done**`);
        let userQuest = prisma.userQuest.create({
            data: {
                userId,
                questId,
                rewardedTypeId: rewardTypeId,
                rewardedQty: currentQuest.quantity,
            },
        });

        try {
            await prisma.$transaction([updatedUser, claimedReward, userQuest]);
        } catch (error) {
            throw error;
        }
    }
    // doing quest as new sign up
    else {
        let newUser = await prisma.whiteList.create({
            data: {
                discordId: id,
                discordUserDiscriminator: `${username}#${discriminator}`,
            },
        });

        // if the transaction fails, user can still do the quest again later.
        if (newUser) {
            console.log(`**Create / Update reward for user**`);
            let claimedReward = prisma.reward.upsert({
                where: {
                    userId_rewardTypeId: { userId: newUser.userId, rewardTypeId },
                },
                update: {
                    quantity: {
                        increment: currentQuest.quantity,
                    },
                },
                create: {
                    userId: newUser.userId,
                    quantity,
                    rewardTypeId,
                },

                select: {
                    userId: true,
                    quantity: true,
                    user: true,
                    rewardTypeId: true,
                    rewardType: true,
                },
            });

            console.log(`**Save to UserQuest, to keep track that its done**`);
            let userQuest = prisma.userQuest.create({
                data: {
                    userId: newUser.userId,
                    questId,
                    rewardedTypeId: rewardTypeId,
                    rewardedQty: currentQuest.quantity,
                },
            });

            try {
                await prisma.$transaction([claimedReward, userQuest]);
            } catch (error) {
                // doing nothing, user can still do the quest later
            }
        }
    }
};

export const submitUserQuestTransaction = async (questId, rewardTypeId, whiteListUser) => {
    let currentQuest = await prisma.quest.findUnique({
        where: {
            questId,
        },
    });
    try {
        console.log(`**Create / Update reward for user**`);

        const { userId } = whiteListUser;
        let claimedReward = prisma.reward.upsert({
            where: {
                userId_rewardTypeId: { userId, rewardTypeId },
            },
            update: {
                quantity: {
                    increment: currentQuest.quantity,
                },
            },
            create: {
                userId,
                quantity: currentQuest.quantity,
                rewardTypeId,
            },

            select: {
                userId: true,
                quantity: true,
                user: true,
                rewardTypeId: true,
                rewardType: true,
            },
        });

        console.log(`**New Quest Submit! Save to UserQuest table**`);
        let userQuest = prisma.userQuest.create({
            data: {
                userId,
                questId,
                rewardedTypeId: rewardTypeId,
                rewardedQty: currentQuest.quantity,
            },
        });

        await prisma.$transaction([userQuest, claimedReward]);
    } catch (error) {
        return { isError: true, questId };
    }
};

export const submitUserDailyQuestTransaction = async (
    questId,
    type,
    rewardTypeId,
    quantity,
    extendedUserQuestData,
    whiteListUser
) => {
    let claimedReward;
    try {
        console.log(`**Create / Update reward for user**`);
        const { userId } = whiteListUser;
        claimedReward = prisma.reward.upsert({
            where: {
                userId_rewardTypeId: { userId, rewardTypeId },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                userId,
                quantity,
                rewardTypeId,
            },

            select: {
                userId: true,
                quantity: true,
                user: true,
                rewardTypeId: true,
                rewardType: true,
            },
        });

        console.log(`**Save to UserQuest for Daily, to keep track that its done**`);
        let userQuest = prisma.userQuest.upsert({
            where: {
                userId_questId: { userId, questId },
            },
            create: {
                userId,
                questId,
                rewardedTypeId: rewardTypeId,
                rewardedQty: quantity,
                extendedUserQuestData,
            },
            update: {
                extendedUserQuestData,
            },
        });

        await prisma.$transaction([claimedReward, userQuest]);

        return userQuest;
    } catch (error) {
        console.log(error);
    }
};

export const updateClaimAndPendingRewardTransaction = async (
    whiteListUser,
    rewardTypeId,
    pendingReward,
    generatedURL,
) => {
    console.log(`** Claiming Reward ${generatedURL} **`);
    const { userId } = whiteListUser;

    let quantity = pendingReward.quantity

    console.log("quantity: ", quantity);
    console.log("rewardTypeId: ", rewardTypeId);
    let claimedReward = prisma.reward.upsert({
        where: {
            userId_rewardTypeId: { userId, rewardTypeId },
        },
        update: {
            quantity: {
                increment: parseInt(quantity),
            },
        },
        create: {
            userId,
            quantity,
            rewardTypeId,
        },
        select: {
            userId: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`** Updating reward ${generatedURL} to claimed **`);
    let updatePendingReward = prisma.pendingReward.update({
        where: {
            userId_rewardTypeId_generatedURL: {
                userId,
                rewardTypeId,
                generatedURL,
            },
        },
        data: {
            isClaimed: true,
        },
    });
    try {
        await prisma.$transaction([claimedReward, updatePendingReward]);

        return claimedReward;
    } catch (error) {
        console.log(error)
    }

};

export const updateUserWalletAndAddRewardTransaction = async (quest, whiteListUser, address) => {
    console.log(`**Update user discord**`);
    let { questId, rewardTypeId, quantity } = quest;

    let currentQuest = await prisma.quest.findUnique({
        where: {
            questId,
        },
    });

    const { userId } = whiteListUser;

    let updatedUser = prisma.whiteList.update({
        where: { userId },
        data: {
            wallet: address,
        },
    });

    console.log(`**Create / Update reward for user**`);
    let claimedReward = prisma.reward.upsert({
        where: {
            userId_rewardTypeId: { userId, rewardTypeId },
        },
        update: {
            quantity: {
                increment: currentQuest.quantity,
            },
        },
        create: {
            userId,
            quantity,
            rewardTypeId,
        },

        select: {
            userId: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`**Save to UserQuest, to keep track that its done**`);
    let userQuest = prisma.userQuest.create({
        data: {
            userId,
            questId,
            rewardedTypeId: rewardTypeId,
            rewardedQty: currentQuest.quantity,
        },
    });

    try {
        await prisma.$transaction([updatedUser, claimedReward, userQuest]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateUserUnstopabbleAndAddRewardTransaction = async (
    quest,
    whiteListUser,
    uauthUser
) => {
    console.log(`**Update user unstopable**`);
    let { questId, rewardTypeId, quantity } = quest;

    let currentQuest = await prisma.quest.findUnique({
        where: {
            questId,
        },
    });

    const { userId } = whiteListUser;

    let updatedUser = prisma.whiteList.update({
        where: { userId },
        data: {
            uathUser: uauthUser,
        },
    });

    console.log(`**Create / Update reward for user**`);
    let claimedReward = prisma.reward.upsert({
        where: {
            userId_rewardTypeId: { userId, rewardTypeId },
        },
        update: {
            quantity: {
                increment: currentQuest.quantity,
            },
        },
        create: {
            userId,
            quantity,
            rewardTypeId,
        },

        select: {
            userId: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`**Save to UserQuest, to keep track that its done**`);
    let userQuest = prisma.userQuest.create({
        data: {
            userId,
            questId,
            rewardedTypeId: rewardTypeId,
            rewardedQty: currentQuest.quantity,
        },
    });

    try {
        await prisma.$transaction([updatedUser, claimedReward, userQuest]);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
