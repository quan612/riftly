/*
  Warnings:

  - The values [ONGOING] on the enum `QuestDuration` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestDuration_new" AS ENUM ('Ongoing', 'LIMITED');
ALTER TABLE "Quest" ALTER COLUMN "duration" DROP DEFAULT;
ALTER TABLE "Quest" ALTER COLUMN "duration" TYPE "QuestDuration_new" USING ("duration"::text::"QuestDuration_new");
ALTER TYPE "QuestDuration" RENAME TO "QuestDuration_old";
ALTER TYPE "QuestDuration_new" RENAME TO "QuestDuration";
DROP TYPE "QuestDuration_old";
ALTER TABLE "Quest" ALTER COLUMN "duration" SET DEFAULT 'Ongoing';
COMMIT;

-- AlterTable
ALTER TABLE "Quest" ALTER COLUMN "duration" SET DEFAULT 'Ongoing';
