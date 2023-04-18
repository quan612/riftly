/*
  Warnings:

  - You are about to drop the `ContractItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingShopItemRedeem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingShopItemRedeem" DROP CONSTRAINT "PendingShopItemRedeem_userId_fkey";

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "multiplier" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "available" SET DEFAULT 1,
ALTER COLUMN "maxPerAccount" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ShopItemRedeem" ADD COLUMN     "extendedRedeemData" JSONB;

-- DropTable
DROP TABLE "ContractItem";

-- DropTable
DROP TABLE "PendingShopItemRedeem";
