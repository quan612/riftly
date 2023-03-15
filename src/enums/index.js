const Enums = {
  BASEPATH: '',
  WALLET: 'Wallet',
  DISCORD: 'Discord',
  TWITTER: 'Twitter',
  METAMASK: 'METAMASK',
  WALLETCONNECT: 'WALLETCONNET',
  EMAIL: 'Email',
  GOOGLE: 'Google',
  REWARDTYPE: {
    MYSTERYBOWL: 'Mystery Bowl',
    NUDE: 'Nude',
    BOREDAPE: 'Bored Ape',
    MINTLIST: 'Mint List',
    SHELL: '$Shell',
  },
  ADMIN_SIGN_MSG: 'Sign to authenticate as admin',
  USER_SIGN_MSG: 'Welcome to the Cove’s DeepSea Challenger!\nSign in to start earning treasure.',

  DAILY: 'daily',
  HOURLY: 'hourly',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',

  PAGINATION_SKIP: 4000,
  /* The number to perform update on large dataset, for when splitting into small chunks,
    (PRO)   60 seconds can be around 200
    (HOBBY) 10 seconds must be < 50
    */
  UPDATE_SKIP: 150,

  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  LAST_YEAR: 'Last Year',
  THIS_YEAR: 'This Year',

  // quest related
  JOIN_DISCORD: 'Join our Discord',

  TWITTER_RETWEET: 'Retweet a Tweet',
  FOLLOW_TWITTER: 'Follow Twitter Account',
  FOLLOW_INSTAGRAM: 'Follow Instagram Account',

  DAILY_SHELL: 'Daily Shell Quest',

  OWNING_NFT_CLAIM: 'Claim Reward For Owning NFT',
  IMAGE_UPLOAD_QUEST: 'Image Upload Quest',
  LIMITED_FREE_SHELL: 'Limited Free $SHELL',

  CODE_QUEST: 'Code Quest',
  UNSTOPPABLE_AUTH: 'Unstoppable Domain Authenticate',
  DISCORD_AUTH: 'Discord Authenticate',
  TWITTER_AUTH: 'Twitter Authenticate',
  WALLET_AUTH: 'Wallet Authenticate',
  SMS_VERIFICATION: 'SMS Verification',

  // Image approval
  ITEM_PER_PAGE: 100,

  CATEGORY_AUTHENTICATION: { title: 'Authentication', type: 'authentication' },
  CATEGORY_SOCIAL_FOLLOW: { title: 'Social Follow', type: 'social_follow' },
  CATEGORY_COMMUNITY_ENGAGEMENT: { title: 'Community Engagement', type: 'engagement' },
  CATEGORY_REWARD_POINTS: { title: 'Reward Points', type: 'reward_point' },
  CATEGORY_SOCIAL_SHARE: { title: 'Social Share', type: 'social_share' },
  CATEGORY_PARTNERSHIP: { title: 'Partnership', type: 'partnership' },
}

module.exports = Enums
