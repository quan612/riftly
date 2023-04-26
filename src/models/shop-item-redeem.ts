import { RedeemStatus } from "@prisma/client";
import { ShopItem } from "./shop-item";
import { WhiteList } from "./whitelist";


export interface ShopItemRedeem {
  id: number,
  shopItem: ShopItem,
  shopItemId: number,
  redeemedBy?: WhiteList,
  userId?: string,
  status: RedeemStatus,
  extendedRedeemData?: any,
  createdAt: Date,
  updatedAt: Date,
}
