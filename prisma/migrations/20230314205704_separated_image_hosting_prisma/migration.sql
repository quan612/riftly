/*
  Warnings:

  - You are about to drop the column `cloudinaryKey` on the `QuestVariables` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryName` on the `QuestVariables` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinarySecret` on the `QuestVariables` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestVariables" DROP COLUMN "cloudinaryKey",
DROP COLUMN "cloudinaryName",
DROP COLUMN "cloudinarySecret";
