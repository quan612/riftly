-- CreateEnum
CREATE TYPE "ItemStyle" AS ENUM ('OFFCHAIN', 'ONCHAIN');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('ERC20', 'ERC721');

-- CreateTable
CREATE TABLE "ShopItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT DEFAULT '',
    "available" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "contractAddress" TEXT,

    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopItemRequirement" (
    "id" SERIAL NOT NULL,
    "requirementId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT '',
    "relationId" INTEGER NOT NULL,
    "conditional" JSONB,
    "shopItemId" INTEGER,

    CONSTRAINT "ShopItemRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractItem" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "type" "ContractType" DEFAULT 'ERC20',
    "abi" JSONB,

    CONSTRAINT "ContractItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopItem_contractAddress_key" ON "ShopItem"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ShopItemRequirement_requirementId_key" ON "ShopItemRequirement"("requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractItem_address_key" ON "ContractItem"("address");

-- AddForeignKey
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_contractAddress_fkey" FOREIGN KEY ("contractAddress") REFERENCES "ContractItem"("address") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItemRequirement" ADD CONSTRAINT "ShopItemRequirement_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
