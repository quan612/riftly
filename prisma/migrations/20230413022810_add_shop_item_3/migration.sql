/*
  Warnings:

  - You are about to drop the column `total` on the `ShopItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopItem" DROP COLUMN "total",
ADD COLUMN     "maxPerAccount" INTEGER NOT NULL DEFAULT 0;
