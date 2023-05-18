// Modules
import { useCallback } from 'react'
import { Session } from 'next-auth'

// Components
import { WalletAuthQuestModal } from '../../../shared'
import ConnectionButton from './ConnectionButton'
import ConnectionInput from './ConnectionInput'
import BlockTitle from '@components/end-user/shared/BlockTitle'

// UI
import { Box, SimpleGrid, GridItem, Text, useDisclosure } from '@chakra-ui/react'

// Utils
import { getTwitterAuthLink, getDiscordAuthLink } from '@util/index'
import { shortenAddress } from '@util/index'

interface IConnectionsInfo {
  session: Session
}

interface IConnectionTitle {
  color: string
  title: string
}

const ConnectionTitle = (props: IConnectionTitle) => {
  const { color, title } = props

  return (
    <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color={color}>
      {title}
    </Text>
  )
}

const ConnectionsInfo = ({ session }: IConnectionsInfo) => {
  const {
    user: { wallet, twitter, discord },
  } = session

  const walletSignUpModal = useDisclosure()

  const onCloseWalletModal = useCallback(() => walletSignUpModal.onClose(), [walletSignUpModal])

  const onConnectWallet = useCallback(async () => {
    walletSignUpModal.onOpen()
  }, [walletSignUpModal])

  const onConnectTwitter = useCallback(async () => {
    const twitterLink = await getTwitterAuthLink()
    return window.open(twitterLink, '_self')
  }, [])

  const onConnectDiscord = useCallback(async () => {
    const discordLink = await getDiscordAuthLink()
    return window.open(discordLink, '_self')
  }, [])

  const onConnectGoogle = useCallback(() => {}, [])

  return (
    <>
      {walletSignUpModal?.isOpen && (
        <WalletAuthQuestModal
          isSignUp
          isOpen={walletSignUpModal.isOpen}
          onClose={onCloseWalletModal}
        />
      )}
      <BlockTitle title="Connections" />
      <Box
        bg="brand.neutral4"
        border="1px solid"
        borderColor="brand.neutral3"
        borderRadius="16px"
        display="flex"
        flexDirection="column"
        gap="16px"
        h="100%"
        justifyItems="center"
        minH="128px"
        minW="100%"
        p="24px"
        position="relative"
      >
        <SimpleGrid columns={2} gap="24px">
          <GridItem colSpan={1}>
            <ConnectionTitle color="purple.300" title="Discord" />
            {discord?.length > 0 ? (
              <ConnectionInput value={discord} />
            ) : (
              <ConnectionButton onClick={onConnectDiscord} title="Connect Discord" />
            )}
          </GridItem>
          <GridItem colSpan={1}>
            <ConnectionTitle color="blue.300" title="Twitter" />
            {twitter?.length > 0 ? (
              <ConnectionInput value={twitter} />
            ) : (
              <ConnectionButton onClick={onConnectTwitter} title="Connect Twitter" />
            )}
          </GridItem>
          <GridItem colSpan={1}>
            <ConnectionTitle color="red.300" title="Google" />
            <ConnectionButton disabled onClick={onConnectGoogle} title="Connect Google" />
          </GridItem>
          <GridItem colSpan={1}>
            <ConnectionTitle color="orange.300" title="Wallet" />
            {wallet?.length > 0 ? (
              <ConnectionInput value={wallet.length > 0 ? shortenAddress(wallet) : ''} />
            ) : (
              <ConnectionButton onClick={onConnectWallet} title="Connect Wallet" />
            )}
          </GridItem>
        </SimpleGrid>
      </Box>
    </>
  )
}

export default ConnectionsInfo
