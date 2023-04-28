import { AccountStatus, ContractType, ItemType } from "@prisma/client"; // need to use enums from prisma
import { ShopItemRequirement } from "./shop-item-requirement";
import { ShopItemRedeem } from "./shop-item-redeem";

export interface ShopItem {
  id: number,
  title: string,
  description: string,
  image?: string,
  available: number,
  maxPerAccount: number,
  multiplier: number,
  isEnabled: boolean,
  requirements?: ShopItemRequirement[],
  itemType: ItemType,
  shopItemRedeem?: ShopItemRedeem[],
  contractAddress?: string,
  contractType?: ContractType,
  abi?: any,
  isRedeemable?: boolean,
  cost?: number,
  redeemAvailable?: number
}