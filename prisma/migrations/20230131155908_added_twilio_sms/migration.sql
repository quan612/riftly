-- CreateTable
CREATE TABLE "SmsVerification" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptedPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmsVerification_userId_key" ON "SmsVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SmsVerification_attemptedPhone_key" ON "SmsVerification"("attemptedPhone");

-- AddForeignKey
ALTER TABLE "SmsVerification" ADD CONSTRAINT "SmsVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
