/*
  Warnings:

  - A unique constraint covering the columns `[reward]` on the table `RewardType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RewardType_reward_key" ON "RewardType"("reward");
