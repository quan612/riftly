/*
  Warnings:

  - You are about to drop the `nftContractData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "nftContractData";

-- CreateTable
CREATE TABLE "NftContractData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "NftContractData_pkey" PRIMARY KEY ("id")
);
