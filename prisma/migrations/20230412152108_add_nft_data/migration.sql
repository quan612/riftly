-- CreateTable
CREATE TABLE "nftContractData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "data" JSONB,

    CONSTRAINT "nftContractData_pkey" PRIMARY KEY ("id")
);
