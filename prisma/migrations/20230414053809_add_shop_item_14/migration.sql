/*
  Warnings:

  - You are about to drop the column `address` on the `ShopItem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ShopItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractAddress]` on the table `ShopItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShopItem_address_key";

-- AlterTable
ALTER TABLE "ShopItem" DROP COLUMN "address",
DROP COLUMN "type",
ADD COLUMN     "contractAddress" TEXT,
ADD COLUMN     "contractType" "ContractType" DEFAULT 'ERC20';

-- CreateIndex
CREATE UNIQUE INDEX "ShopItem_contractAddress_key" ON "ShopItem"("contractAddress");
