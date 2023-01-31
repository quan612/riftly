import { prisma } from "context/PrismaContext";

export const updateTwitterUserQuestTransaction = async (quest, userId, userInfo) => {
    try {
        let { questId } = quest;
        const { id, username } = userInfo;

        if (!id || !username) {
            throw new Error("Cannot get twitter id or twitter username from auth");
        }

        if (userId) {
            let updatedUser = prisma.whiteList.update({
                where: { userId },
                data: {
                    twitterId: id,
                    twitterUserName: username,
                },
            });

            let userQuest = prisma.UserQuest.create({
                data: {
                    userId,
                    questId,
                    isClaimable: true,
                },
            });

            await prisma.$transaction([updatedUser, userQuest]);
        } else {
            let newUser = await prisma.whiteList.create({
                data: {
                    twitterId: id,
                    twitterUserName: username,
                },
            });

            if (newUser) {
                await prisma.UserQuest.create({
                    data: {
                        userId: newUser.userId,
                        questId,
                        isClaimable: true,
                    },
                });
            }
        }
    } catch (error) {
        throw error;
    }
};

export const updateDiscordUserQuestTransaction = async (quest, userId, userInfo) => {
    try {
        let { questId } = quest;
        const { id, username, discriminator } = userInfo;

        if (!id || !username) {
            throw new Error("Cannot get twitter id or twitter username from auth");
        }

        if (userId) {
            let updatedUser = prisma.whiteList.update({
                where: { userId },
                data: {
                    discordId: id,
                    discordUserDiscriminator: `${username}#${discriminator}`,
                },
            });

            let userQuest = prisma.userQuest.create({
                data: {
                    userId,
                    questId,
                    isClaimable: true,
                },
            });

            await prisma.$transaction([updatedUser, userQuest]);
        } else {
            let newUser = await prisma.whiteList.create({
                data: {
                    discordId: id,
                    discordUserDiscriminator: `${username}#${discriminator}`,
                },
            });

            if (newUser) {
                await prisma.userQuest.create({
                    data: {
                        userId: newUser.userId,
                        questId,
                        isClaimable: true,
                    },
                });
            }
        }
    } catch (error) {
        throw error;
    }
};

export const updateUserWalletTransaction = async (questId, userId, wallet) => {
    try {
        if (userId) {
            let updatedUser = prisma.whiteList.update({
                where: { userId },
                data: {
                    wallet,
                },
            });

            let userQuest = prisma.userQuest.create({
                data: {
                    userId,
                    questId,
                    isClaimable: true,
                },
            });

            await prisma.$transaction([updatedUser, userQuest]);
        } else {
            let tryFindUser = await prisma.whiteList.findUnique({
                where: { wallet },
            })

            if (!tryFindUser) {
                let newUser = await prisma.whiteList.create({
                    data: {
                        wallet,
                    },
                });
                if (newUser) {
                    await prisma.userQuest.create({
                        data: {
                            userId: newUser.userId,
                            questId,
                            isClaimable: true,
                        },
                    });
                }
            }
        }
    } catch (error) {

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


export const submitUserQuestTransaction = async (questId, userId) => {
    try {
        return await prisma.userQuest.upsert({
            where: {
                userId_questId: { userId, questId },
            },
            update: {
                isClaimable: true,
            },
            create: {
                userId,
                questId,
                isClaimable: true,
            },
        });
    } catch (error) {
        throw error;
    }
};
export const submitUserDailyQuestTransaction = async (questId, extendedUserQuestData, userId) => {
    try {
        return await prisma.userQuest.upsert({
            where: {
                userId_questId: { userId, questId },
            },
            create: {
                userId,
                questId,
                extendedUserQuestData,
            },
            update: {
                extendedUserQuestData,
            },
        });
    } catch (error) {
        throw error;
    }
};

export const claimUserQuestTransaction = async (questId, rewardTypeId, quantity, userId) => {
    try {
        let claimedReward = prisma.reward.upsert({
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
        });

        let userQuest = prisma.userQuest.update({
            where: {
                userId_questId: { userId, questId },
            },
            data: {
                rewardedTypeId: rewardTypeId,
                rewardedQty: quantity,
                hasClaimed: true,
            },
        });

        await prisma.$transaction([userQuest, claimedReward]);
        return userQuest;
    } catch (error) {
        throw error;
    }
};

export const claimUserDailyQuestTransaction = async (
    questId,
    rewardTypeId,
    quantity,
    extendedUserQuestData,
    userId
) => {

    try {
        console.log(`**Upsert daily quest**`);

        let claimedReward = prisma.Reward.upsert({
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
        });

        let userQuest = prisma.UserQuest.update({
            where: {
                userId_questId: { userId, questId },
            },
            data: {
                extendedUserQuestData,
            },
        });

        await prisma.$transaction([claimedReward, userQuest]);

        return userQuest;
    } catch (error) {
        throw error;
    }
};

export const updateClaimAndPendingRewardTransaction = async (
    whiteListUser,
    rewardTypeId,
    pendingReward,
    generatedURL
) => {
    console.log(`** Claiming Reward ${generatedURL} **`);
    const { userId } = whiteListUser;

    let quantity = pendingReward.quantity;

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
        console.log(error);
    }
};

