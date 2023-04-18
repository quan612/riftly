-- CreateTable
CREATE TABLE "ShopItemRedeem" (
    "id" SERIAL NOT NULL,
    "shopItemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShopItemRedeem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopItemRedeem_userId_shopItemId_key" ON "ShopItemRedeem"("userId", "shopItemId");

-- AddForeignKey
ALTER TABLE "ShopItemRedeem" ADD CONSTRAINT "ShopItemRedeem_shopItemId_fkey" FOREIGN KEY ("shopItemId") REFERENCES "ShopItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItemRedeem" ADD CONSTRAINT "ShopItemRedeem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
