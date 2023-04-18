/*
  Warnings:

  - A unique constraint covering the columns `[requirementId]` on the table `RedeemRequirement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requirementId` to the `RedeemRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RedeemRequirement" ADD COLUMN     "requirementId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RedeemRequirement_requirementId_key" ON "RedeemRequirement"("requirementId");
