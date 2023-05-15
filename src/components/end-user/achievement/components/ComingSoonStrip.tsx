// Components
import { HeadingSm, TextSm } from '@components/shared/Typography'
import DesktopHorizontalLine from './DesktopHorizontalLine'
import Circle from './Circle'

// UI
import { Heading, Box, Flex, Grid, GridItem, useTheme } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

interface IComingSoonStrip {
  isMobile: boolean
  index: number
  templateColumns: string
}

const ComingSoonStrip = ({ isMobile, index, templateColumns }: IComingSoonStrip) => {
  const theme = useTheme()

  return (
    <Box position="relative">
      <Grid
        templateColumns={templateColumns}
        zIndex="2"
        position="relative"
        gap={isMobile ? '60px' : '0px'} //gap on mobile only vertical
      >
        <GridItem className="left-wrapper" position="relative">
          <Box position="relative" h="100%" display="flex" alignItems="center">
            {!isMobile && <DesktopHorizontalLine bg={theme.colors.brand.neutral3} />}
            <Box
              className="circle-wrapper"
              w={isMobile ? '100%' : '50%'}
              h="auto"
              zIndex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Flex w="80%" h="80%" bg="brand.neutral5" alignItems="center" justifyContent="center">
                <Circle color={theme.colors.brand.neutral3} />
              </Flex>

              <Box position="absolute" display="flex" justifyContent="center">
                <Heading fontWeight="700" size="md" color={theme.colors.brand.neutral3}>
                  {index}
                </Heading>
              </Box>
            </Box>
          </Box>
        </GridItem>

        <GridItem className="right-wrapper" zIndex="1">
          <ChakraBox
            h={{ base: '112px', md: '96px' }}
            maxH={{ base: '112px', md: '96px' }}
            w="100%"
            bg="brand.neutral4"
            border="1px solid"
            borderColor={theme.colors.brand.neutral3}
            borderRadius="16px"
          >
            <Box display="flex" flex="1" h="100%">
              <Box
                className="user-achievement-claim"
                h="100%"
                display="flex"
                flexDirection="row"
                flex="1"
                px={{ base: '12px', md: '16px' }}
                alignItems="center"
              >
                <Box h="60%" display="flex" flex="1">
                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    flex="1"
                    alignItems="center"
                  >
                    <Flex display="flex" flexDirection="column">
                      <>
                        <HeadingSm color={theme.colors.white}>Coming Soon</HeadingSm>
                        <TextSm fontWeight="400" color="whiteAlpha.700" noOfLines={2}>
                          Finish the last achievements to reveal new rewards!
                        </TextSm>
                      </>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </Box>
          </ChakraBox>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default ComingSoonStrip
