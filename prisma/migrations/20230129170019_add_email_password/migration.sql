/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WhiteList" ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_email_key" ON "WhiteList"("email");
