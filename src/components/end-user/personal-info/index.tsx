// Modules
import { Session } from 'next-auth'

// Components
import AccountInfo from './components/AccountInfo'
import ConnectionsInfo from './components/ConnectionsInfo'
import Settings from './components/Settings'

// UI
import { Box } from '@chakra-ui/react'

interface IPersonalInfo {
  session: Session
}

const PersonalInfo = ({ session }: IPersonalInfo) => (
  <Box
    display="flex"
    flexDirection="column"
    gap="16px"
    paddingBottom="24px"
    position="relative"
    top="32px"
    w="100%"
  >
    <AccountInfo session={session} />
    <ConnectionsInfo session={session} />
    <Settings />
  </Box>
)

export default PersonalInfo
