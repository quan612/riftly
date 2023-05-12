-- CreateTable
CREATE TABLE "AchievementItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT DEFAULT '',
    "rewardId" INTEGER DEFAULT 0,
    "rewardQty" INTEGER NOT NULL DEFAULT 1,
    "onChainMultiplier" INTEGER DEFAULT 1,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "itemType" "ItemType" NOT NULL DEFAULT 'OFFCHAIN',
    "contractAddress" TEXT,
    "contractType" "ContractType" DEFAULT 'ERC20',
    "chain" TEXT DEFAULT 'Ethereum',
    "network" TEXT DEFAULT 'Ethereum Goerli',
    "abi" JSONB,

    CONSTRAINT "AchievementItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementRequirement" (
    "id" SERIAL NOT NULL,
    "requirementId" TEXT NOT NULL,
    "requirementType" TEXT NOT NULL DEFAULT '',
    "relationId" INTEGER NOT NULL,
    "conditional" JSONB,
    "achievementItemId" INTEGER,

    CONSTRAINT "AchievementRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AchievementRequirement_requirementId_key" ON "AchievementRequirement"("requirementId");

-- AddForeignKey
ALTER TABLE "AchievementRequirement" ADD CONSTRAINT "AchievementRequirement_achievementItemId_fkey" FOREIGN KEY ("achievementItemId") REFERENCES "AchievementItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
