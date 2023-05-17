import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { ShopItem } from 'models/shop-item'
import { QUERY_USER_REWARD } from './reward'

export const SHOP_ITEM_QUERY = 'shop-item-query'

export const useShopItemQuery = () => {
  const { data, isLoading } = useQuery(
    SHOP_ITEM_QUERY,
    async () => {
      return axios.get<ShopItem[]>(`${Enums.BASEPATH}/api/user/reward/shop/get-shop-item`).then((r) => r.data)
    },
    { staleTime: 60 },
  )

  return { data, isLoading }
}

export const useOffChainShopItemRedeemMutation = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/reward/shop/off-chain-redeem`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(SHOP_ITEM_QUERY);
        queryClient.invalidateQueries(QUERY_USER_REWARD);
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useOnChainShopItemRedeemMutation = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/reward/shop/on-chain-redeem`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(SHOP_ITEM_QUERY);
        queryClient.invalidateQueries(QUERY_USER_REWARD);
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useERC1155RedeemMutation = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/reward/shop/erc1155-redeem`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(SHOP_ITEM_QUERY);
        queryClient.invalidateQueries(QUERY_USER_REWARD);
      },
    },
  )

  return [data, isLoading, mutateAsync]
}