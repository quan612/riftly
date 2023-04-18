/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `RedeemableTracker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,contract]` on the table `RedeemableTracker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RedeemableTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RedeemableTracker" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RedeemableTracker_userId_key" ON "RedeemableTracker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RedeemableTracker_userId_contract_key" ON "RedeemableTracker"("userId", "contract");

-- AddForeignKey
ALTER TABLE "RedeemableTracker" ADD CONSTRAINT "RedeemableTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
