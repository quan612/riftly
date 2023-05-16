// Components
import { RiftlyFace } from '@components/shared/Logo'

// UI
import { Box, Image } from '@chakra-ui/react'

interface IUserTierAvatar {
  avatar: string
}

const UserTierAvatar = ({ avatar }: IUserTierAvatar) => (
  <Box
    alignItems="center"
    className="quest-user-avatar"
    display="flex"
    h="100%"
    justifyContent="center"
    minW={{ base: '96px', lg: '128px' }}
    w={{ base: '96px', lg: '128px' }}
  >
    <Box boxSize="72px" position="relative">
      {avatar && avatar?.trim().length > 5 ? (
        <Image borderRadius="50%" src={avatar} />
      ) : (
        <RiftlyFace />
      )}
    </Box>
  </Box>
)

export default UserTierAvatar
