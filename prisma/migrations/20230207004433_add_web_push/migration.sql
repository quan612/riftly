-- CreateTable
CREATE TABLE "WebPushSubscription" (
    "id" SERIAL NOT NULL,
    "subscriptionObj" JSONB,

    CONSTRAINT "WebPushSubscription_pkey" PRIMARY KEY ("id")
);
