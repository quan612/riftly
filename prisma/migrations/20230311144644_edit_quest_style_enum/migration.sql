/*
  Warnings:

  - The values [Ongoing,Limited] on the enum `QuestDuration` will be removed. If these variants are still used in the database, this will fail.
  - The values [Featured] on the enum `QuestStyle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestDuration_new" AS ENUM ('ONGOING', 'LIMITED');
ALTER TABLE "Quest" ALTER COLUMN "duration" DROP DEFAULT;
ALTER TABLE "Quest" ALTER COLUMN "duration" TYPE "QuestDuration_new" USING ("duration"::text::"QuestDuration_new");
ALTER TYPE "QuestDuration" RENAME TO "QuestDuration_old";
ALTER TYPE "QuestDuration_new" RENAME TO "QuestDuration";
DROP TYPE "QuestDuration_old";
ALTER TABLE "Quest" ALTER COLUMN "duration" SET DEFAULT 'ONGOING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuestStyle_new" AS ENUM ('Normal', 'FEATURED');
ALTER TABLE "Quest" ALTER COLUMN "style" DROP DEFAULT;
ALTER TABLE "Quest" ALTER COLUMN "style" TYPE "QuestStyle_new" USING ("style"::text::"QuestStyle_new");
ALTER TYPE "QuestStyle" RENAME TO "QuestStyle_old";
ALTER TYPE "QuestStyle_new" RENAME TO "QuestStyle";
DROP TYPE "QuestStyle_old";
ALTER TABLE "Quest" ALTER COLUMN "style" SET DEFAULT 'Normal';
COMMIT;

-- AlterTable
ALTER TABLE "Quest" ALTER COLUMN "duration" SET DEFAULT 'ONGOING';
