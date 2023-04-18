/*
  Warnings:

  - A unique constraint covering the columns `[contract]` on the table `ConfigRedeemableContract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ConfigRedeemableContract" ALTER COLUMN "contract" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "ConfigRedeemableContract_contract_key" ON "ConfigRedeemableContract"("contract");
