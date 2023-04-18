/*
  Warnings:

  - You are about to drop the `RedeemableTracker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RedeemableTracker" DROP CONSTRAINT "RedeemableTracker_userId_fkey";

-- DropTable
DROP TABLE "RedeemableTracker";

-- CreateTable
CREATE TABLE "PendingShopItemRedeem" (
    "id" SERIAL NOT NULL,
    "shopItemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PendingShopItemRedeem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingShopItemRedeem_userId_shopItemId_key" ON "PendingShopItemRedeem"("userId", "shopItemId");

-- AddForeignKey
ALTER TABLE "PendingShopItemRedeem" ADD CONSTRAINT "PendingShopItemRedeem_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingShopItemRedeem" ADD CONSTRAINT "PendingShopItemRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
