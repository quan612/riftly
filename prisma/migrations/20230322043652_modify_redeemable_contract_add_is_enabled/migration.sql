-- AlterTable
ALTER TABLE "ConfigRedeemableContract" ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "image" SET DEFAULT '',
ALTER COLUMN "nftType" SET DEFAULT '';
