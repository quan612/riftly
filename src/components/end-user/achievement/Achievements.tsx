// Modules
import { useRef } from 'react'

// Components
import UserTierLevel from '../dashboard/UserTierLevel'
import CircleProgress from './components/CircleProgress'
import Circle from './components/Circle'
import ComingSoonStrip from './components/ComingSoonStrip'
import DesktopHorizontalLine from './components/DesktopHorizontalLine'
import DesktopVerticalLine from './components/DesktopVerticalLine'
import MobileVerticalLineBottom from './components/MobileVerticalLineBottom'
import MobileVerticalTop from './components/MobileVerticalTop'
import TripBox from './components/TripBox'

// Constants
import { achievementsArray } from './constants'

// Hooks
import useDeviceDetect from '@hooks/useDeviceDetect'
import useGetColor from './useGetColor'

// UI
import { Heading, Box, Flex, Grid, GridItem, useTheme } from '@chakra-ui/react'

const AchievementHeader = () => {
  const theme = useTheme()
  return (
    <Box display="flex" justifyContent="space-between">
      <Heading color={theme.colors.white} fontWeight="600" size="md">
        Achievements
      </Heading>
    </Box>
  )
}

const Achievements = ({ session }) => {
  const { isMobile } = useDeviceDetect()
  const { getColor } = useGetColor()

  const levelProgress = useRef(0)
  const templateColumns = isMobile ? '1fr' : '1fr 3fr'

  return (
    <>
      <UserTierLevel ref={levelProgress} session={session} />

      <Box display="flex" flexDirection="column" gap="16px" position="relative" minH="auto">
        <AchievementHeader />

        <Box h="auto" display="flex" flexDirection="column" gap="64px">
          {achievementsArray &&
            achievementsArray.map((achievement, index) => {
              const { id, isLocked, progress } = achievement
              return (
                <Box position="relative" key={index}>
                  {isMobile && index > 0 && (
                    <MobileVerticalTop index={index} achievement={achievement} />
                  )}
                  <Grid
                    gap={isMobile ? '48px' : '0px'} //gap on mobile only vertical
                    position="relative"
                    templateColumns={templateColumns}
                    zIndex="2"
                  >
                    <GridItem className="left-wrapper">
                      <Box position="relative" w="100%" h="100%" display="flex" alignItems="center">
                        {!isMobile && <DesktopHorizontalLine bg={getColor(achievement)} />}

                        <Box
                          alignItems="center"
                          className="circle-wrapper"
                          display="flex"
                          h="auto"
                          justifyContent="center"
                          w={isMobile ? '100%' : '50%'}
                        >
                          {!isLocked && (
                            <Flex
                              alignItems="center"
                              bg="brand.neutral5"
                              h="80%"
                              justifyContent="center"
                              position="relative"
                              w="80%"
                            >
                              <Circle color={getColor(achievement)} />
                            </Flex>
                          )}
                          {isLocked && (
                            <Flex
                              alignItems="center"
                              bg="brand.neutral5"
                              h="100%"
                              justifyContent="center"
                              position="relative"
                              w="100%"
                              zIndex="1"
                            >
                              <CircleProgress progress={progress} />
                            </Flex>
                          )}
                          <Box
                            className="order-number"
                            display="flex"
                            justifyContent="center"
                            position="absolute"
                            zIndex="1"
                          >
                            <Heading fontWeight="700" size="md" color={getColor(achievement)}>
                              {achievement.id}
                            </Heading>
                          </Box>
                          <MobileVerticalLineBottom
                            index={index}
                            achievementsArray={achievementsArray}
                            achievement={achievement}
                          />
                        </Box>
                      </Box>
                    </GridItem>

                    <GridItem className="right-wrapper" zIndex={1}>
                      <TripBox item={achievement} index={index} id={id} />
                    </GridItem>
                  </Grid>
                  {!isMobile && (
                    <DesktopVerticalLine
                      achievement={achievement}
                      achievementsArray={achievementsArray}
                      index={index}
                    />
                  )}
                </Box>
              )
            })}
          <ComingSoonStrip
            index={achievementsArray.length + 1}
            isMobile={isMobile}
            templateColumns={templateColumns}
          />
        </Box>
      </Box>
    </>
  )
}

export default Achievements
