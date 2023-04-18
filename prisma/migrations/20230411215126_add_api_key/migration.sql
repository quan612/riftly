/*
  Warnings:

  - You are about to drop the `ConfigApp` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "QuestVariables" ADD COLUMN     "apiKey" TEXT DEFAULT '';

-- DropTable
DROP TABLE "ConfigApp";
