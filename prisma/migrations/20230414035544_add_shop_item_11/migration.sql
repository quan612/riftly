-- DropForeignKey
ALTER TABLE "ShopItemRedeem" DROP CONSTRAINT "ShopItemRedeem_userId_fkey";

-- AlterTable
ALTER TABLE "ShopItemRedeem" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopItemRedeem" ADD CONSTRAINT "ShopItemRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
