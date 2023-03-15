/*
  Warnings:

  - The values [FEATURED] on the enum `QuestStyle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestStyle_new" AS ENUM ('Normal', 'Featured');
ALTER TABLE "Quest" ALTER COLUMN "style" DROP DEFAULT;
ALTER TABLE "Quest" ALTER COLUMN "style" TYPE "QuestStyle_new" USING ("style"::text::"QuestStyle_new");
ALTER TYPE "QuestStyle" RENAME TO "QuestStyle_old";
ALTER TYPE "QuestStyle_new" RENAME TO "QuestStyle";
DROP TYPE "QuestStyle_old";
ALTER TABLE "Quest" ALTER COLUMN "style" SET DEFAULT 'Normal';
COMMIT;
