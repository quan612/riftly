import type Prisma from '@prisma/client'

export interface WhiteListAggregate extends Prisma.WhiteList {
  userQuest: Prisma.UserQuest[]
  rewards: Prisma.Reward[]
}

export type RewardFilterType = {
  readonly id?: number

  label?: string
  maxQty?: number
  minQty?: number
  value?: string
}
