-- CreateTable
CREATE TABLE "WhiteList" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT,
    "twitterId" TEXT DEFAULT '',
    "twitterUserName" TEXT DEFAULT '',
    "userId" TEXT NOT NULL,
    "discordId" TEXT DEFAULT '',
    "discordUserDiscriminator" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nonce" TEXT,
    "uathUser" TEXT DEFAULT '',

    CONSTRAINT "WhiteList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteListUserData" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "WhiteListUserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingReward" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT,
    "generatedURL" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "rewardTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "PendingReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,
    "wallet" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardType" (
    "id" SERIAL NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "RewardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "QuestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT,
    "questId" TEXT NOT NULL,
    "extendedUserQuestData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardedQty" INTEGER,
    "rewardedTypeId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completedText" TEXT NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT DEFAULT '',
    "extendedQuestData" JSONB,
    "questId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questTypeId" INTEGER NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "nonce" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoralisNftData" (
    "id" SERIAL NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "contractData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoralisNftData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogError" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "referer" TEXT,
    "userAgent" TEXT,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logRegister" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "referer" TEXT,
    "userAgent" TEXT,
    "wallet" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shellRedeemed" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT,
    "rewards" TEXT[],
    "rewardPointer" INTEGER NOT NULL DEFAULT -1,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "shellRedeemed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestVariables" (
    "id" SERIAL NOT NULL,
    "vercel_env" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "discordSecret" TEXT NOT NULL,
    "discordBackend" TEXT NOT NULL,
    "discordBackendSecret" TEXT NOT NULL,
    "twitterId" TEXT NOT NULL,
    "twitterSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestVariables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discord" (
    "id" SERIAL NOT NULL,
    "channelId" TEXT NOT NULL,
    "channel" TEXT,

    CONSTRAINT "Discord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_wallet_key" ON "WhiteList"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_userId_key" ON "WhiteList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteListUserData_userId_key" ON "WhiteListUserData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_userId_rewardTypeId_generatedURL_key" ON "PendingReward"("userId", "rewardTypeId", "generatedURL");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_userId_rewardTypeId_key" ON "Reward"("userId", "rewardTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestType_name_key" ON "QuestType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "UserQuest"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_questId_key" ON "Quest"("questId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_wallet_key" ON "Admin"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "MoralisNftData_contractAddress_key" ON "MoralisNftData"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "shellRedeemed_wallet_key" ON "shellRedeemed"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "shellRedeemed_userId_key" ON "shellRedeemed"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Discord_channelId_key" ON "Discord"("channelId");

-- AddForeignKey
ALTER TABLE "WhiteListUserData" ADD CONSTRAINT "WhiteListUserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("questId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_rewardedTypeId_fkey" FOREIGN KEY ("rewardedTypeId") REFERENCES "RewardType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_questTypeId_fkey" FOREIGN KEY ("questTypeId") REFERENCES "QuestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
