/*
  Warnings:

  - You are about to drop the column `postMessageWhenClaimed` on the `Discord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discord" DROP COLUMN "postMessageWhenClaimed";
