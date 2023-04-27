import { ModalOverlay, Modal, ModalContent } from '@chakra-ui/react'
import Image from 'next/image'

export default function Loading() {
  return (
    <Modal isOpen isCentered>
      <ModalOverlay bg="#1D3148" opacity="0.9!important" />
      <ModalContent
        w={'container.sm'}
        bg={'transparent'}
        maxW="container.sm"
        transition={'1.25s'}
        alignItems="center"
        justifyContent={'center'}
        boxShadow="none"
        className="loading"
      >
        <Image
          position={'absolute'}
          src="/img/user/loading.webp"
          width="150px"
          height="70px"
          objectFit="cover"
        />
      </ModalContent>
    </Modal>
  )
}
