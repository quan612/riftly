/*
  Warnings:

  - You are about to drop the column `isClaimed` on the `UserQuest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserQuest" DROP COLUMN "isClaimed",
ADD COLUMN     "isClaimable" BOOLEAN NOT NULL DEFAULT false;
