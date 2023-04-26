import { useQueryClient, useQuery, useMutation } from 'react-query'
import axios from 'axios'
import Enums from 'enums'
import { useRouter } from 'next/router'
import { UserQuest } from 'models/user-quest'
import { QUERY_USER_REWARD } from './reward'

export const QUERY_USER_QUEST = 'user-query-user-quest'

export const useUserQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/general`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserDailyQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/recurrent`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useCodeQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/code-quest`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useNftOwningQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useWalletAuthQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`${Enums.BASEPATH}/api/user/wallet-sign-up`, payload).then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const usePhoneNumberQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/send-phone-for-sms`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

/* only after code sent to user phone*/
export const usePhoneCodeQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/send-code-for-verification`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUserQuestClaim = () => {
  const { data, error, isError, isLoading, isSuccess, mutate, mutateAsync } = useMutation(
    (payload) => {
      return axios.post(`/api/user/quest/claim`, payload).then((r) => r.data)
    },
    // manual invalid on component side, not here
  )

  return [data, isLoading, mutateAsync]
}

export const useUserOwningNftQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (quest) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/nft-quest`, quest)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useUnstoppableAuthQuestSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (payload) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/unstoppable-auth`, payload)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_QUEST)
        queryClient.invalidateQueries('user-query-feature-quest')
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

export const useImageUploadSubmit = () => {
  const queryClient = useQueryClient()

  const { data, error, isLoading, mutateAsync } = useMutation(
    (quest) => {
      return axios
        .post(`${Enums.BASEPATH}/api/user/quest/submit/image-upload`, quest)
        .then((r) => r.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_USER_REWARD)
      },
    },
  )

  return [data, isLoading, mutateAsync]
}

/*******************************Query********************************************** */
export const useUserQuestQuery = () => {
  const { data, isLoading } = useQuery(
    QUERY_USER_QUEST,
    async () => {
      return axios
        .get<UserQuest[]>(`${Enums.BASEPATH}/api/user/quest/get-normal`)
        .then((r) => r.data)
    },
    { staleTime: Infinity, cacheTime: 60 * 60 },
  )

  return { data, isLoading }
}

export const useUserFeatureQuestQuery = () => {
  const { data, isLoading } = useQuery(
    'user-query-feature-quest',
    async () => {
      return axios
        .get<UserQuest[]>(`${Enums.BASEPATH}/api/user/quest/get-featured`)
        .then((r) => r.data)
    },
    { staleTime: Infinity, cacheTime: 60 * 60 },
  )

  return { data, isLoading }
}

export const useUserCollaborationQuestQuery = () => {
  const router = useRouter()
  const collaboration =
    typeof router?.query?.collaboration === 'string' ? router?.query?.collaboration : ''

  const { data, isLoading } = useQuery(
    'user-query-collaboration-quest',
    async () => {
      return axios
        .get(`${Enums.BASEPATH}/api/user/quest/collaboration/${collaboration}`)
        .then((r) => r.data)
    },
    { enabled: !!collaboration, staleTime: 60 },
  )

  return { data, isLoading }
}
