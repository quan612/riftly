const Enums = {
    BASEPATH: "/challenger",
    DISCORD: "Discord",
    TWITTER: "Twitter",
    METAMASK: "METAMASK",
    WALLETCONNECT: "WALLETCONNET",
    REWARDTYPE: {
        MYSTERYBOWL: "Mystery Bowl",
        NUDE: "Nude",
        BOREDAPE: "Bored Ape",
        MINTLIST: "Mint List",
        SHELL: "$Shell",
    },
    ADMIN_SIGN_MSG: "Sign to authenticate as admin",
    USER_SIGN_MSG: "Welcome to the Cove’s DeepSea Challenger!\nSign in to start earning treasure.",

    DAILY: "daily",
    HOURLY: "hourly",
    WEEKLY: "weekly",
    MONTHLY: "monthly",

    // quest related
    JOIN_DISCORD: "Join our Discord",
    DISCORD_AUTH: "Discord Authenticate",
    TWITTER_AUTH: "Twitter Authenticate",
    WALLET_AUTH: "Wallet Authenticate",
    TWITTER_RETWEET: "Retweet a Tweet",
    FOLLOW_TWITTER: "Follow Twitter Account",
    FOLLOW_INSTAGRAM: "Follow Instagram Account",
    ZED_CLAIM: "Own ZED to claim $SHELL", // deprecated
    NOODS_CLAIM: "Own NOODS to claim $SHELL", // deprecated
    OWNING_NFT_CLAIM: "Claim Reward For Owning NFT",
    IMAGE_UPLOAD_QUEST: "Anomura #SUBMISSION Quest",
    LIMITED_FREE_SHELL: "Limited Free $SHELL",
    COLLABORATION_FREE_SHELL: "Free $SHELL On Collaboration", // deprecated, collaboration is determined based on quest.extendedQuestData
    DAILY_SHELL: "Daily Shell Quest",
    CODE_QUEST: "Code Quest",
    UNSTOPPABLE_AUTH: "Unstoppable Domain Authenticate",

    // Image approval
    ITEM_PER_PAGE: 100,

    // SHELL REDEEM
    SHELL_PRICE: 1300,
    MAX_ROLL_REDEEM: 3,
    OCTOHEDZ_VX_NFT: "OctoHedz: VX NFT" //done
    , OCTOHEDZ_RELOADED: "OctoHedz: Reloaded" //done
    , COLORMONSTER_NFT: "ColorMonsters NFT" // done
    , MIRAKAI_SCROLLS_NFT: "Mirakai Scrolls NFT" // done
    , ALLSTARZ_NFT: "Allstarz NFT" // done
    , ETHER_JUMP_NFT: "Etherjump NFT" // done
    , META_HERO_NFT: "MetaHero NFT" // done
    , EX_8102_NFT: "8102 NFT" // done
    , VOID_RUNNERS_NFT: "Void Runners NFT" // done
    , ZEN_ACADEMY_NFT: "ZenAcademy NFT" // done
    , HUMAN_PARK_NFT: "Human Park NFT" // done
    , NAME_INGAME: "Name a character!" // done
    , ADOPT_ANIMAL: "Adopt an Animal" // done
    , FREE_MINT: "Free Mint" // done
    , EARLY_ACCESS: "Game Concept Demo Private Viewing" //done
    , ONE_TO_ONE: "Anomura Team Meet" //done
    , ANOMURA_STICKER: "Crab Swag" //done
    , ANOMURA_PFP: "Anomura Avatar"
    , ANOMURA_DOWNLOADABLE_STUFFS: "Downloadable Anomur-ART" // done
    , GIFT_MINT_LIST_SPOT: "Gift Mintlist to a fren" //done
    , MINT_LIST_SPOT: "Mintlist Spot" // done
    , BOOTS: "A Beautiful Boot"  //done
};

module.exports = Enums;