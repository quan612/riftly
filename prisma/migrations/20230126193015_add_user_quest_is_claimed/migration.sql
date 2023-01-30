/*
  Warnings:

  - You are about to drop the column `wallet` on the `UserQuest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserQuest" DROP COLUMN "wallet",
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL DEFAULT false;
