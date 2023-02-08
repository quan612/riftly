/*
  Warnings:

  - You are about to drop the column `subscriptionObj` on the `WebPushSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WebPushSubscription" DROP COLUMN "subscriptionObj",
ADD COLUMN     "auth" TEXT,
ADD COLUMN     "endPoint" TEXT,
ADD COLUMN     "p256dh" TEXT;
