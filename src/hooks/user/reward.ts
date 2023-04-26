import { useQuery } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { Session } from 'next-auth'

export const QUERY_USER_REWARD = 'user-reward-query'

export const useUserRewardQuery = (session: Session) => {
  const userId = session?.user.userId
  const { data, isLoading } = useQuery(
    [QUERY_USER_REWARD, userId],
    () => {
      return axios.get(`${Enums.BASEPATH}/api/user/reward/get-claimed/${userId}`).then((r) => r.data)
    },
    {
      staleTime: 60 * 60,
      cacheTime: 60 * 60,
      enabled: userId !== undefined,
    },
  )

  return [data, isLoading]
}
