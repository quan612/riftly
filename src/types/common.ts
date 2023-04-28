import type Prisma from '@prisma/client'
import { WhiteList } from '@prisma/client'
import { Quest } from 'models/quest'
import { ShopItem } from 'models/shop-item'
import { NextApiRequest } from 'next'

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


export interface WhiteListApiRequest extends NextApiRequest {
  whiteListUser: WhiteList
  currentQuest?: Quest
  shopItem?: ShopItem
}
