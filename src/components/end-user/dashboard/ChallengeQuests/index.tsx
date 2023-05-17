// Modules
import { useState } from 'react'

// Components
import Loading from '@components/shared/LoadingContainer/Loading'
import ChallengesHeader from './components/ChallengesHeader'
import UserQuestBox from './components/UserQuestBox'

// Hooks
import { useUserQuestQuery } from '@hooks/user/quest'

// UI
import { Box } from '@chakra-ui/react'

const ChallengeQuests = () => {
  const [filterCompleted, filterCompletedSet] = useState(false)
  const { data: userQuests, isLoading: isFetchingUserQuests } = useUserQuestQuery()

  return (
    <Box display="flex" flexDirection="column" gap="16px" position="relative" minH="auto">
      {isFetchingUserQuests && <Loading />}
      <ChallengesHeader filterCompleted={filterCompleted} filterCompletedSet={filterCompletedSet} />

      <Box h="auto" display="flex" flexDirection="column" gap="16px">
        {userQuests &&
          userQuests.length > 0 &&
          userQuests
            ?.filter((q) => {
              if (filterCompleted) {
                return q.hasClaimed === true
              } else {
                return q.hasClaimed === false
              }
            })
            .map((quest, index) => {
              return (
                <Box
                  bg="brand.neutral4"
                  border="1px solid"
                  borderColor="brand.neutral3"
                  borderRadius="16px"
                  h={{ base: '112px', md: '96px' }}
                  key={quest.id}
                  maxH={{ base: '112px', md: '96px' }}
                  w="100%"
                >
                  <Box display="flex" flexDirection="row" w="100%">
                    <UserQuestBox quest={quest} filterCompleted={filterCompleted} key={index} />
                  </Box>
                </Box>
              )
            })}
      </Box>
    </Box>
  )
}

export default ChallengeQuests
