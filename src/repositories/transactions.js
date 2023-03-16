import { DISCORD, TWITTER, WALLET } from '@enums/index'
import { prisma } from 'context/PrismaContext'
import { getAccountStatusToAdd } from './user'

export const updateTwitterUserQuestTransaction = async (quest, userId, userInfo) => {

  let { questId } = quest
  const { id, username } = userInfo

  if (!id || !username) {
    throw new Error('Cannot get twitter id or twitter username from auth')
  }

  let accountStatus = await getAccountStatusToAdd()

  if (userId) {
    let updatedUser = prisma.whiteList.update({
      where: { userId },
      data: {
        twitterId: id,
        twitterUserName: username,
      },
    })

    let userQuest = prisma.UserQuest.create({
      data: {
        userId,
        questId,
        isClaimable: true,
      },
    })

    await prisma.$transaction([updatedUser, userQuest])
  } else {
    let newUser = await prisma.whiteList.create({
      data: {
        twitterId: id,
        twitterUserName: username,
        status: accountStatus,
        signUpOrigin: TWITTER,
      },
    })

    if (newUser) {
      await prisma.UserQuest.create({
        data: {
          userId: newUser.userId,
          questId,
          isClaimable: true,
        },
      })
    }
  }

}

export const updateDiscordUserQuestTransaction = async (questId, userId, userInfo) => {

  const { id, username, discriminator } = userInfo

  if (!id || !username) {
    throw new Error('Cannot get twitter id or twitter username from auth')
  }

  if (userId) {
    let updatedUser = prisma.whiteList.update({
      where: { userId },
      data: {
        discordId: id,
        discordUserDiscriminator: `${username}#${discriminator}`,
      },
    })

    let userQuest = prisma.userQuest.create({
      data: {
        userId,
        questId,
        isClaimable: true,
      },
    })

    await prisma.$transaction([updatedUser, userQuest])
  } else {
    let accountStatus = await getAccountStatusToAdd()
    let newUser = await prisma.whiteList.create({
      data: {
        discordId: id,
        discordUserDiscriminator: `${username}#${discriminator}`,
        status: accountStatus,
        signUpOrigin: DISCORD,
      },
    })

    if (newUser) {
      await prisma.userQuest.create({
        data: {
          userId: newUser.userId,
          questId,
          isClaimable: true,
        },
      })
    }
  }

}

export const updateUserWalletTransaction = async (questId, userId, wallet) => {

  if (userId) {
    let updatedUser = prisma.whiteList.update({
      where: { userId },
      data: {
        wallet,
      },
    })

    let userQuest = prisma.userQuest.create({
      data: {
        userId,
        questId,
        isClaimable: true,
      },
    })

    await prisma.$transaction([updatedUser, userQuest])
  } else {
    let accountStatus = await getAccountStatusToAdd()
    let newUser = await prisma.whiteList.create({
      data: {
        wallet,
        status: accountStatus,
        signUpOrigin: WALLET,
      },
    })
    if (newUser) {
      await prisma.userQuest.create({
        data: {
          userId: newUser.userId,
          questId,
          isClaimable: true,
        },
      })
    }
  }

}

export const updateUserUnstopabbleAndAddRewardTransaction = async (
  quest,
  userId,
  uauthUser,
) => {
  console.log(`**Update user unstopable**`)
  let { questId, rewardTypeId, quantity } = quest


  if (userId) {
    let updatedUser = prisma.whiteList.update({
      where: { userId },
      data: {
        uathUser: uauthUser,
      },
    })

    let userQuest = prisma.userQuest.create({
      data: {
        userId,
        questId,
        rewardedTypeId: rewardTypeId,
        rewardedQty: quantity,
      },
    })

    await prisma.$transaction([updatedUser, userQuest])
  } else {
    let accountStatus = await getAccountStatusToAdd()
    let newUser = await prisma.whiteList.create({
      data: {
        uathUser: uauthUser,
        status: accountStatus,
        signUpOrigin: WALLET,
      },
    })
    if (newUser) {
      await prisma.userQuest.create({
        data: {
          userId: newUser.userId,
          questId,
          isClaimable: true,
        },
      })
    }
  }


}

export const submitUserQuestTransaction = async (questId, userId) => {

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
  })

}
export const submitUserDailyQuestTransaction = async (questId, extendedUserQuestData, userId) => {

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
  })

}

export const claimUserQuestTransaction = async (questId, rewardTypeId, quantity, userId) => {

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
  })

  let userQuest = prisma.userQuest.update({
    where: {
      userId_questId: { userId, questId },
    },
    data: {
      rewardedTypeId: rewardTypeId,
      rewardedQty: quantity,
      hasClaimed: true,
    },
  })

  await prisma.$transaction([userQuest, claimedReward])
  return userQuest

}

export const claimUserDailyQuestTransaction = async (
  questId,
  rewardTypeId,
  quantity,
  extendedUserQuestData,
  userId,
) => {

  console.log(`**Upsert daily quest**`)

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
  })

  let userQuest = prisma.UserQuest.update({
    where: {
      userId_questId: { userId, questId },
    },
    data: {
      extendedUserQuestData,
    },
  })

  await prisma.$transaction([claimedReward, userQuest])

  return userQuest

}

export const updateClaimAndPendingRewardTransaction = async (
  whiteListUser,
  rewardTypeId,
  pendingReward,
  generatedURL,
) => {
  console.log(`** Claiming Reward ${generatedURL} **`)
  const { userId } = whiteListUser

  let quantity = pendingReward.quantity

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
  })

  console.log(`** Updating reward ${generatedURL} to claimed **`)
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
  })

  await prisma.$transaction([claimedReward, updatePendingReward])

  return claimedReward

}
