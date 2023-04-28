import { prisma } from '../context/PrismaContext'
import { utils } from 'ethers'
import { Session } from 'next-auth'

export const isWhiteListUser = async (session: Session) => {
  if (!session) {
    return null
  }

  let user
  if (session?.provider === 'discord') {
    user = await prisma.whiteList.findFirst({
      where: {
        discordId: session?.user?.id,
      },
    })
  }
  if (session?.provider === 'twitter') {
    user = await prisma.whiteList.findFirst({
      where: {
        twitterId: session?.user?.id,
      },
    })
  }
  if (session?.provider === 'email') {
    user = await prisma.whiteList.findUnique({
      where: {
        email: session?.user?.email,
      },
    })
  }
  if (session?.provider === 'unstoppable-authenticate') {
    user = await prisma.whiteList.findFirst({
      where: {
        uathUser: session?.user?.uathUser,
      },
    })
  }
  // session login through wallet
  if (session?.user?.wallet) {
    user = await prisma.whiteList.findUnique({
      where: {
        wallet: utils.getAddress(session?.user?.wallet),
      },
    })
  }

  if (!user) {
    return null
  }
  return user
}


