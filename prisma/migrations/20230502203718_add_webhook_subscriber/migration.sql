-- CreateTable
CREATE TABLE "WebhookSubscriber" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "eventId" INTEGER,
    "url" TEXT,

    CONSTRAINT "WebhookSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebhookSubscriber_url_key" ON "WebhookSubscriber"("url");
