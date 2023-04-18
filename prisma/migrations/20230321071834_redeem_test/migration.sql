-- CreateTable
CREATE TABLE "RedeemableTracker" (
    "id" SERIAL NOT NULL,
    "contract" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RedeemableTracker_pkey" PRIMARY KEY ("id")
);
