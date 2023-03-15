import {
  Box,
  useStyleConfig,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  Spinner,
} from '@chakra-ui/react'

function Card(props) {
  const { variant, children, ...rest } = props
  const styles = useStyleConfig('Card', { variant })

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  )
}

export default Card

export const AdminCard = ({ children, bg = 'brand.neutral4', ...rest }) => {
  const shadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'none')

  return (
    <Card boxShadow={shadow} p={{ base: '16px', md: '24px', lg: '32px' }} bg={bg} {...rest}>
      {children}
    </Card>
  )
}

export const MiniStatistics = (props) => {
  const { isLoading, startContent, endContent, name, growth, value } = props
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'secondaryGray.600'

  return (
    <Card py="15px">
      {isLoading && (
        <Flex
          my="auto"
          h="56px"
          align={{ base: 'center', xl: 'center' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Spinner size="lg" />
        </Flex>
      )}
      {!isLoading && (
        <Flex
          my="auto"
          h="100%"
          align={{ base: 'center', xl: 'start' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          {startContent}

          <Stat my="auto" ms={startContent ? '18px' : '0px'}>
            <StatLabel
              lineHeight="100%"
              color={textColorSecondary}
              fontSize={{
                base: 'sm',
              }}
            >
              {name}
            </StatLabel>
            <StatNumber
              color={textColor}
              fontSize={{
                base: '2xl',
              }}
            >
              {value}
            </StatNumber>

            {growth !== null && growth !== undefined && growth !== 'null' && (
              <Flex align="center">
                <Text
                  color={`${growth > 0 ? 'green.500' : 'red.400'}`}
                  fontSize="xs"
                  fontWeight="700"
                  me="5px"
                >
                  {growth}%
                </Text>
                <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                  since last month
                </Text>
              </Flex>
            )}
          </Stat>
          <Flex ms="auto" w="max-content">
            {endContent}
          </Flex>
        </Flex>
      )}
      {/*  */}
    </Card>
  )
}

export const AdminBanner = ({ children }) => {
  return (
    <Flex
      direction={{ base: 'column' }}
      h="160px"
      align="center"
      backdropFilter="blur(21px)"
      borderRadius="20px"
      __css={{
        background:
          'linear-gradient(rgba(29, 99, 255, 0.5),  rgba(29, 99, 255, 0.5)), url(/img/user/banner.png)',
      }}
      backgroundPosition="center"
      backgroundSize={'cover'}
      backgroundRepeat="no-repeat"
      display={'flex'}
      flexDirection="column"
      alignItems="center"
      justifyContent={'center'}
      p={{ base: '12px', lg: '2rem' }}
      zIndex={999}
      mt="20px"
    >
      {children}
    </Flex>
  )
}
