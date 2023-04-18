-- CreateTable
CREATE TABLE "ConfigRedeemableContract" (
    "id" SERIAL NOT NULL,
    "contract" TEXT NOT NULL DEFAULT '',
    "maxRedeemable" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConfigRedeemableContract_pkey" PRIMARY KEY ("id")
);
