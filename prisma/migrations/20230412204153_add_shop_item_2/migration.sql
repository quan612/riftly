-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('OFFCHAIN', 'ONCHAIN');

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "itemType" "ItemType" NOT NULL DEFAULT 'OFFCHAIN';

-- DropEnum
DROP TYPE "ItemStyle";
