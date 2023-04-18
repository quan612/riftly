/*
  Warnings:

  - You are about to drop the column `quantity` on the `RedeemRequirement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RedeemRequirement" DROP COLUMN "quantity",
ADD COLUMN     "conditional" JSONB;
