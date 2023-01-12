/*
  Warnings:

  - You are about to drop the column `imagePreview` on the `RewardType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RewardType" DROP COLUMN "imagePreview",
ADD COLUMN     "rewardPreview" TEXT;
