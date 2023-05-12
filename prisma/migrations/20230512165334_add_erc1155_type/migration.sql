/*
  Warnings:

  - You are about to drop the `ConfigRedeemableContract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RedeemRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logRegister` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ContractType" ADD VALUE 'ERC1155';

-- DropForeignKey
ALTER TABLE "RedeemRequirement" DROP CONSTRAINT "RedeemRequirement_redeemId_fkey";

-- DropTable
DROP TABLE "ConfigRedeemableContract";

-- DropTable
DROP TABLE "RedeemRequirement";

-- DropTable
DROP TABLE "logRegister";
