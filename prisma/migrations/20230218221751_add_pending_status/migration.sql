-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "WhiteList" ADD COLUMN     "status" "AccountStatus" DEFAULT 'PENDING';
