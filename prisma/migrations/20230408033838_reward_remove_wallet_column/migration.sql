/*
  Warnings:

  - You are about to drop the column `wallet` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the `MoralisNftData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shellRedeemed` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "wallet";

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "wallet";

-- DropTable
DROP TABLE "MoralisNftData";

-- DropTable
DROP TABLE "shellRedeemed";
