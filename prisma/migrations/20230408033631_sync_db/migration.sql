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

-- CreateIndex
CREATE UNIQUE INDEX "shellRedeemed_wallet_key" ON "shellRedeemed"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "shellRedeemed_userId_key" ON "shellRedeemed"("userId");
