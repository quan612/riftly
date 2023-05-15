// Types
import { AchievementType } from './types'

export const achievementsArray: AchievementType[] = [
  {
    id: 1,
    isClaimed: true,
    isLocked: false,
    text: 'Welcome to Riftly',
    description: 'Bonus reward for starting your journey',
    quantity: 100,
  },
  {
    id: 2,
    isClaimed: false,
    isLocked: false,
    text: 'Reach Tier 5',
    description: 'Reach tier 5 to unlock this reward!',
    quantity: 100,
  },
  {
    id: 3,
    isClaimed: false,
    isLocked: false,
    text: 'Log in 10 days in a row',
    description: 'Check in every day to unlock this reward',
    quantity: 100,
  },
  {
    id: 4,
    isClaimed: false,
    isLocked: true,
    text: 'Completed 10 quests',
    description: 'Bonus reward for finishing 10 quests!',
    quantity: 100,
    progress: 50,
  },
  {
    id: 5,
    isClaimed: false,
    isLocked: true,
    text: 'Completed all KYC quests',
    description: 'Bonus reward for completing all know your customer quests!',
    quantity: 100,
    progress: 33,
  },
  {
    id: 6,
    isClaimed: false,
    isLocked: true,
    text: 'Own certain Nfts',
    description: 'Bonus reward for owning several Nfts!',
    quantity: 100,
    progress: 70,
  },
]
