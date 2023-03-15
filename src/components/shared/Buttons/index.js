import { CloseButton } from '@chakra-ui/react'

export const RiftlyModalCloseButton = ({ onClose }) => {
  return (
    <CloseButton
      onClick={onClose}
      outline={'none'}
      display={'flex'}
      alignItems="center"
      justifyContent="center"
      position={'absolute'}
      top={2}
      right={2}
      transition="1s"
      color={'brand.blue'}
      fontSize={{ base: '10px', md: '8px', lg: '10px' }}
      border="1px solid"
      borderColor={'brand.blue'}
      borderRadius={{ base: '50%', md: '35%' }}
      w={{ base: '24px', md: '36px', lg: '40px' }}
      h={{ base: '24px', md: '36px', lg: '40px' }}
      _hover={{
        border: '1px solid',
        bg: 'brand.blue',
        transition: '1s',
        color: '#fff',
      }}
      _active={{
        outline: 'none',
        bg: 'brand.blue',
        transition: '1s',
        color: '#fff',
        border: '1px solid',
        borderColor: '#fff',
      }}
      _focus={{
        outline: 'none',
        border: '1px solid',
        color: '#fff',
        borderColor: '#fff',
        bg: 'brand.blue',
      }}
    />
  )
}
