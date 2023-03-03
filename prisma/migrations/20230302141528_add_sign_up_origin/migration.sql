-- AlterTable
ALTER TABLE "WhiteList" ADD COLUMN     "signUpOrigin" TEXT DEFAULT 'Wallet';

-- CreateTable
CREATE TABLE "AdminLogError" (
    "id" SERIAL NOT NULL,
    "route" TEXT,
    "message" TEXT,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLogError_pkey" PRIMARY KEY ("id")
);
