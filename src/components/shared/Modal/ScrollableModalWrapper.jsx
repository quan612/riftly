import React from 'react'
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react'

import { RiftlyModalCloseButton } from '@components/shared/Buttons'

// This is used specifically for New Quest Modal, since it has many nested children
const ScrollableModalWrapper = ({
  showCloseButton,
  isOpen,
  onClose,
  handleOnClose,
  gap = '36px',
  header,
  footer,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="16px"
        maxH="85%"
        w={{ base: '100%', lg: 'container.md' }}
        maxW="container.md"
        bg={'brand.neutral4'}
        transition={'1.25s'}
        alignItems="center"
        justifyContent={'center'}
        overflow={'hidden'}
        me={{ base: '24px', xl: '0px' }}
        ms={{ base: '24px', xl: '0px' }}
      >
        {showCloseButton && <RiftlyModalCloseButton onClose={handleOnClose} />}

        <ModalHeader w="100%">{header}</ModalHeader>
        <ModalBody
          overflow={'auto'}
          w="100%"
          h="100%"
          sx={{
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Flex
            gap={gap}
            direction="column"
            alignItems={'center'}
            justifyContent={'center'}
            h="100%"
            w={'100%'}
            position={'relative'}
          >
            {children}
          </Flex>
        </ModalBody>

        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ScrollableModalWrapper
