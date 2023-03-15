import { prisma } from '@context/PrismaContext'
import { AccountStatus } from '@prisma/client'

export const getAccountStatusToAdd = async () => {
  let accountStatus = AccountStatus.PENDING
  let requiredSmsVerification = getIsSMSVerificationRequired()

  if (!requiredSmsVerification) {
    accountStatus = AccountStatus.ACTIVE
  }
  return accountStatus
}

export const getIsSMSVerificationRequired = async () => {
  let allConfigs = await prisma.questVariables.findFirst()
  return allConfigs.requiredSmsVerification
}

export const getWhiteListUserByUserName = async (username) => {
  return await prisma.whiteList.findFirst({
    where: {
      OR: [
        {
          userId: username,
        },
        {
          discordId: username,
        },
        {
          twitterId: username,
        },
        {
          wallet: username,
        },
        {
          discordUserDiscriminator: username,
        },
        {
          twitterUserName: username,
        },
      ],
    },
  })
}

export const getWhiteListUserByWallet = async (wallet) => {
  return await prisma.whiteList.findUnique({
    where: {
      // wallet: { equals: wallet, mode: "insensitive" },
      wallet,
    },
  })
}

export const getWhiteListUserByUserId = async (userId) => {
  return await prisma.whiteList.findUnique({
    where: {
      userId,
    },
  })
}
