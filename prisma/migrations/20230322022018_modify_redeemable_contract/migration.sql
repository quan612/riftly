-- AlterTable
ALTER TABLE "ConfigRedeemableContract" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image" TEXT,
ADD COLUMN     "nftType" TEXT,
ADD COLUMN     "text" TEXT NOT NULL DEFAULT '';
