/*
  Warnings:

  - You are about to drop the `shellRedeemed` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ConfigRedeemableContract" ADD COLUMN     "contractAbi" JSONB,
ADD COLUMN     "totalRedeemable" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "shellRedeemed";

-- CreateTable
CREATE TABLE "RedeemRequirement" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL DEFAULT '',
    "relationId" INTEGER NOT NULL,
    "quantity" INTEGER DEFAULT 0,
    "redeemId" INTEGER,

    CONSTRAINT "RedeemRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RedeemRequirement" ADD CONSTRAINT "RedeemRequirement_redeemId_fkey" FOREIGN KEY ("redeemId") REFERENCES "ConfigRedeemableContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
