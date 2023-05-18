// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import FeatureCard from './components/FeatureCard'
import BlockTitle from '@components/end-user/shared/BlockTitle'

// Hooks
import { useUserFeatureQuestQuery } from '@hooks/user/quest'

// UI
import { Box } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

const FeaturedQuests = () => {
  const { data: featureQuests, isLoading: isFetchingFeatureQuests } = useUserFeatureQuestQuery()

  return (
    <AnimatePresence>
      {featureQuests && featureQuests?.length > 0 && (
        <ChakraBox display="flex" flexDirection="column" exit={{ opacity: 0 }} gap="16px">
          <BlockTitle title="Featured" />

          <Box display="flex" overflowX="auto" position="relative" gap="16px">
            {featureQuests.map((quest) => (
              <FeatureCard key={quest.id} quest={quest} />
            ))}
          </Box>
        </ChakraBox>
      )}
    </AnimatePresence>
  )
}

export default FeaturedQuests
