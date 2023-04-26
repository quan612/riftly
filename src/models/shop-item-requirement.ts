import { ShopItem } from "./shop-item";

export interface ShopItemRequirement {
  id: number,
  requirementId: string,
  requirementType: string,
  relationId: number,
  conditional?: any,
  shopItem?: ShopItem,
  shopItemId?: number,
}