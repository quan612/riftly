/*
  Warnings:

  - You are about to drop the column `canNotifyChallenge` on the `WhiteListUserData` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `WhiteListUserData` table. All the data in the column will be lost.
  - You are about to drop the column `lastNotified` on the `WhiteListUserData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WhiteListUserData" DROP COLUMN "canNotifyChallenge",
DROP COLUMN "data",
DROP COLUMN "lastNotified",
ADD COLUMN     "eth" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "followers" INTEGER DEFAULT 0,
ADD COLUMN     "lastEthUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastFollowersUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
