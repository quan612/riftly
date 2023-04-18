-- CreateTable
CREATE TABLE "ConfigApp" (
    "id" SERIAL NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigApp_pkey" PRIMARY KEY ("id")
);
