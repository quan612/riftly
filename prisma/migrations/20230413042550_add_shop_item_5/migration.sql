/*
  Warnings:

  - You are about to drop the column `kind` on the `ShopItemRequirement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopItemRequirement" DROP COLUMN "kind",
ADD COLUMN     "requirementType" TEXT NOT NULL DEFAULT '';
