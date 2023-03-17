import { useQuery } from 'react-query'
import axios from 'axios'

import Enums from 'enums'

export const useUserRewardQuery = (session) => {
  let userId = session?.user?.userId
  const { data, isLoading } = useQuery(
    ['user-reward-query', userId],
    () => {
      return axios.get(`${Enums.BASEPATH}/api/user/reward/get-claimed/${userId}`).then((r) => r.data)
    },
    {
      staleTime: 60 * 60,
      enabled: userId !== undefined,
    },
  )

  return [data, isLoading]
}
