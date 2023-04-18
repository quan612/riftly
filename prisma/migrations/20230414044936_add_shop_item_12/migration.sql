/*
  Warnings:

  - You are about to drop the column `contractAddress` on the `ShopItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopItemId]` on the table `ContractItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ShopItem" DROP CONSTRAINT "ShopItem_contractAddress_fkey";

-- AlterTable
ALTER TABLE "ContractItem" ADD COLUMN     "shopItemId" INTEGER;

-- AlterTable
ALTER TABLE "ShopItem" DROP COLUMN "contractAddress";

-- CreateIndex
CREATE UNIQUE INDEX "ContractItem_shopItemId_key" ON "ContractItem"("shopItemId");

-- AddForeignKey
ALTER TABLE "ContractItem" ADD CONSTRAINT "ContractItem_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
