-- CreateEnum
CREATE TYPE "RedeemStatus" AS ENUM ('PENDING', 'REDEEMED');

-- AlterTable
ALTER TABLE "ShopItemRedeem" ADD COLUMN     "status" "RedeemStatus" NOT NULL DEFAULT 'PENDING';
