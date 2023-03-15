-- CreateTable
CREATE TABLE "ConfigImageHosting" (
    "id" SERIAL NOT NULL,
    "cloudinaryName" TEXT DEFAULT '',
    "cloudinaryKey" TEXT DEFAULT '',
    "cloudinarySecret" TEXT DEFAULT '',
    "generalPreset" TEXT DEFAULT '',
    "avatarPreset" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfigImageHosting_pkey" PRIMARY KEY ("id")
);
