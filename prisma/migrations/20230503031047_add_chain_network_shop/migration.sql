-- AlterEnum
ALTER TYPE "ContractType" ADD VALUE 'ERC721A';

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "chain" TEXT DEFAULT 'Ethereum',
ADD COLUMN     "network" TEXT DEFAULT 'Ethereum Goerli';
