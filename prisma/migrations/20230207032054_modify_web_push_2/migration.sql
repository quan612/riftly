/*
  Warnings:

  - You are about to drop the column `endPoint` on the `WebPushSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WebPushSubscription" DROP COLUMN "endPoint",
ADD COLUMN     "endpoint" TEXT;
