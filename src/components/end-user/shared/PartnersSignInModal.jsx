import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Heading, Text, Button, HStack, Progress } from '@chakra-ui/react'
import useDeviceDetect from '@hooks/useDeviceDetect'

import { Web3Context } from '@context/Web3Context'
import Enums from '@enums/index'
import { useRouter } from 'next/router'
import ModalWrapper from '../wrappers/ModalWrapper'
import { UnstoppableIcon } from '@components/shared/Icons'

const CONNECTABLE = 1
const AUTHENTICATING = 2
const AUTHENTICATED = 3
const ERROR = 4

const PartnersSignInModal = ({ isOpen, onClose }) => {
  const { isMobile } = useDeviceDetect()
  const [error, errorSet] = useState()
  const { unstoppableLogin } = useContext(Web3Context)
  const [currentView, setView] = useState(CONNECTABLE)
  const router = useRouter()

  const onLoginUnstoppable = useCallback(async () => {
    try {
      await unstoppableLogin()

      setView(AUTHENTICATED)
    } catch (error) {
      errorSet(error.message)
    }
  }, [])

  const handleOnClose = () => {
    errorSet(null)
    onClose()
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === CONNECTABLE && (
        <>
          <Heading color="white" fontSize={'30px'} align="center">
            Connect via Partners
          </Heading>

          <Button
            variant="outline-light-blue"
            onClick={() => onLoginUnstoppable()}
            minW="100%"
            borderRadius="24px"
          >
            <HStack>
              <UnstoppableIcon />
              <Text>Unstoppable Domain</Text>
            </HStack>
          </Button>

          {error && <Text color="red.300">{error}</Text>}
        </>
      )}

      {currentView === AUTHENTICATED && <Text>Redirecting...</Text>}
    </ModalWrapper>
  )
}

export default PartnersSignInModal
