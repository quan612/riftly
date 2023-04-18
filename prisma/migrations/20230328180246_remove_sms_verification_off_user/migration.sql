/*
  Warnings:

  - You are about to drop the `SmsVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SmsVerification" DROP CONSTRAINT "SmsVerification_userId_fkey";

-- DropTable
DROP TABLE "SmsVerification";
