/*
  Warnings:

  - You are about to drop the column `shopItemId` on the `ContractItem` table. All the data in the column will be lost.
  - You are about to drop the column `shopItemId` on the `PendingShopItemRedeem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address]` on the table `ShopItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ContractItem" DROP CONSTRAINT "ContractItem_shopItemId_fkey";

-- DropForeignKey
ALTER TABLE "PendingShopItemRedeem" DROP CONSTRAINT "PendingShopItemRedeem_shopItemId_fkey";

-- DropIndex
DROP INDEX "ContractItem_shopItemId_key";

-- DropIndex
DROP INDEX "PendingShopItemRedeem_userId_shopItemId_key";

-- AlterTable
ALTER TABLE "ContractItem" DROP COLUMN "shopItemId";

-- AlterTable
ALTER TABLE "PendingShopItemRedeem" DROP COLUMN "shopItemId";

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "abi" JSONB,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "type" "ContractType" DEFAULT 'ERC20';

-- CreateIndex
CREATE UNIQUE INDEX "ShopItem_address_key" ON "ShopItem"("address");
