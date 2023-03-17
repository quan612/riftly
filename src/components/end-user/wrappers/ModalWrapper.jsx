import React from 'react'
import { Flex, Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'

import { RiftlyModalCloseButton } from '@components/shared/Buttons'

const ModalWrapper = ({ isOpen, onClose, handleOnClose, gap = '36px', children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="16px"
        minH={{ base: '275px', lg: '384px' }}
        // w={{ base: "280px", md: "container.sm" }}
        w={'container.sm'}
        bg={'brand.neutral4'}
        maxW="container.sm"
        transition={'1.25s'}
        alignItems="center"
        justifyContent={'center'}
        me={{ base: '24px', xl: '0px' }}
        ms={{ base: '24px', xl: '0px' }}
      >
        <RiftlyModalCloseButton onClose={handleOnClose} />

        <ModalBody
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          w="100%"
          maxH={'100%'}
          padding={{ base: '42px 60px 48px 60px', md: '84px 120px 96px 120px' }}
        >
          <Flex
            gap={gap}
            direction="column"
            alignItems={'center'}
            justifyContent={'center'}
            h="100%"
            w={{ base: '100%' }}
            position={'relative'}
          >
            {children}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ModalWrapper
