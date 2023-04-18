import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { useRouter } from 'next/router'

export const useShopItemQuery = () => {
  const { data, isLoading } = useQuery(
    'shop-item-query',
    async () => {
      return axios.get(`${Enums.BASEPATH}/api/user/reward/shop/get-shop-item`).then((r) => r.data)
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
        queryClient.invalidateQueries('shop-item-query');
        queryClient.invalidateQueries('user-reward-query');
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
        queryClient.invalidateQueries('shop-item-query');
        queryClient.invalidateQueries('user-reward-query');
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

