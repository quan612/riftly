-- CreateEnum
CREATE TYPE "QuestStyle" AS ENUM ('NORMAL', 'FEATURED');

-- CreateEnum
CREATE TYPE "QuestDuration" AS ENUM ('ONGOING', 'LIMITED');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "duration" "QuestDuration" NOT NULL DEFAULT 'ONGOING',
ADD COLUMN     "style" "QuestStyle" NOT NULL DEFAULT 'NORMAL';
