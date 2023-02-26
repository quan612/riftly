import React, { useEffect, useState, useCallback, useRef } from "react";

import { Heading, Box, Flex, Text, Button, useToast, Grid, GridItem } from "@chakra-ui/react";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

import { useQueryClient } from "react-query";
import { HeadingLg, HeadingSm, TextSm } from "@components/shared/Typography";
import UserTierLevel from "../dashboard/UserTierLevel";
import { useDeviceDetect } from "lib/hooks";
let achievementsArray = [
    {
        id: 1,
        isClaimed: true,
        isLocked: false,
        text: "Welcome to Riftly",
        description: "Bonus reward for starting your journey",
        quantity: 100,
    },
    {
        id: 2,
        isClaimed: false,
        isLocked: false,
        text: "Reach Tier 5",
        description: "Reach tier 5 to unlock this reward!",
        quantity: 100,
    },
    {
        id: 3,
        isClaimed: false,
        isLocked: false,
        text: "Log in 10 days in a row",
        description: "Check in every day to unlock this reward",
        quantity: 100,
    },
    {
        id: 4,
        isClaimed: false,
        isLocked: true,
        text: "Completed 10 quests",
        description: "Bonus reward for finishing 10 quests!",
        quantity: 100,
        progress: 50,
    },
    {
        id: 5,
        isClaimed: false,
        isLocked: true,
        text: "Completed all KYC quests",
        description: "Bonus reward for completing all know your customer quests!",
        quantity: 100,
        progress: 33,
    },
    {
        id: 6,
        isClaimed: false,
        isLocked: true,
        text: "Own certain Nfts",
        description: "Bonus reward for owning several Nfts!",
        quantity: 100,
        progress: 70,
    },
];

const Achievements = ({ session }) => {
    const { isMobile } = useDeviceDetect();
    let levelProgress = useRef(0);
    return (
        <>
            <UserTierLevel ref={levelProgress} session={session} />

            <Box
                display="flex"
                flexDirection={"column"}
                gap={"16px"}
                position={"relative"}
                minH="auto"
            >
                <AchievementHeader />

                <Box h="auto" display={"flex"} flexDirection={"column"} gap={"64px"}>
                    {achievementsArray &&
                        achievementsArray.map((achievement, index) => {
                            const {
                                id,
                                isClaimed,
                                isLocked,
                                text,
                                description,
                                quantity,
                                progress,
                            } = achievement;
                            return (
                                <Box position={"relative"} key={index}>
                                    {isMobile && index > 0 && (
                                        <MobileVerticalTop
                                            index={index}
                                            achievement={achievement}
                                        />
                                    )}
                                    <Grid
                                        templateColumns={`${isMobile ? "1fr" : "1fr 3fr"}`}
                                        zIndex={"2"}
                                        position="relative"
                                        gap={`${isMobile ? "48px" : "0px"}`} //gap on mobile only vertical
                                    >
                                        <GridItem className="left-wrapper">
                                            <Box
                                                position={"relative"}
                                                w="100%"
                                                h="100%"
                                                display={"flex"}
                                                alignItems="center"
                                            >
                                                {!isMobile && (
                                                    <DesktopHorizontalLine
                                                        bg={getColor(achievement)}
                                                    />
                                                )}

                                                <Box
                                                    className="circle-wrapper"
                                                    w={`${isMobile ? "100%" : "50%"}`}
                                                    h="auto"
                                                    display={"flex"}
                                                    alignItems="center"
                                                    justifyContent={"center"}
                                                >
                                                    {!isLocked && (
                                                        <Flex
                                                            position={"relative"}
                                                            alignItems="center"
                                                            justifyContent={"center"}
                                                            w="80%"
                                                            h="80%"
                                                            bg="brand.neutral5"
                                                        >
                                                            <Circle
                                                                stroke={getColor(achievement)}
                                                            />
                                                        </Flex>
                                                    )}
                                                    {isLocked && (
                                                        <Flex
                                                            position={"relative"}
                                                            alignItems="center"
                                                            justifyContent={"center"}
                                                            w="100%"
                                                            h="100%"
                                                            bg="brand.neutral5"
                                                            zIndex={"1"}
                                                        >
                                                            <CircleProgress progress={progress} />
                                                        </Flex>
                                                    )}
                                                    <Box
                                                        className="order-number"
                                                        position="absolute"
                                                        display="flex"
                                                        justifyContent="center"
                                                        zIndex={"1"}
                                                    >
                                                        <Heading
                                                            fontWeight="700"
                                                            size="md"
                                                            color={getColor(achievement)}
                                                        >
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
                                            index={index}
                                            achievementsArray={achievementsArray}
                                            achievement={achievement}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    <ComingSoonStrip isMobile={isMobile} index={achievementsArray.length + 1} />
                </Box>
            </Box>
        </>
    );
};

const getColor = (achievement) => {
    if (!achievement) return "#fff";
    const { isClaimed, isLocked } = achievement;

    if (isClaimed) {
        return "#1D63FF";
    }
    if (!isClaimed && !isLocked) {
        return "#00BBC7";
    }
    if (isLocked) {
        return "#fff";
    }
};
const Circle = ({ style = {}, stroke }) => {
    return (
        <svg
            style={style}
            width="64"
            height="65"
            viewBox="0 0 64 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M32 4C35.6696 4 39.3045 4.73235 42.6978 6.15661C46.0911 7.58091 49.1778 9.66999 51.7803 12.3072C54.3829 14.9445 56.4502 18.0783 57.8615 21.531C59.2729 24.9838 60 28.6863 60 32.4267C60 36.167 59.2729 39.8695 57.8615 43.3223C56.4502 46.775 54.3829 49.9088 51.7803 52.5462C49.1778 55.1833 46.0911 57.2724 42.6978 58.6967C39.3045 60.121 35.6696 60.8533 32 60.8533C28.3304 60.8533 24.6954 60.121 21.3022 58.6967C17.9089 57.2724 14.8222 55.1833 12.2197 52.5461C9.61707 49.9088 7.54981 46.775 6.13846 43.3223C4.72708 39.8695 4 36.167 4 32.4267C4 28.6863 4.72709 24.9838 6.13847 21.531C7.54982 18.0783 9.61708 14.9445 12.2197 12.3072C14.8222 9.66998 17.9089 7.5809 21.3022 6.1566C24.6955 4.73235 28.3304 4 32 4L32 4Z"
                stroke={stroke}
                strokeWidth="8"
            />
        </svg>
    );
};
const CircleProgress = ({ progress }) => {
    return (
        <>
            <Box position={"absolute"} boxSize="80px">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    preserveAspectRatio="xMinYMin meet"
                >
                    <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#fff" strokeWidth="12" />
                </svg>
            </Box>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                preserveAspectRatio="xMinYMin meet"
                style={{ zIndex: "2" }}
            >
                <circle
                    transform="rotate(-90 40 40)"
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#00BBC7"
                    strokeWidth="12"
                    strokeDasharray="213.52"
                    strokeDashoffset={` ${213.52 - (213.52 * progress) / 100}`}
                />
            </svg>
        </>
    );
};

export default Achievements;
const AchievementHeader = () => {
    return (
        <Box display={"flex"} justifyContent="space-between">
            <Heading color="white" fontWeight="600" size="md">
                Achievements
            </Heading>
        </Box>
    );
};
const TripBox = ({ id, item, index }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [disableBtn, disableBtnSet] = useState(false);

    const [showScore, showScoreSet] = useState(false);
    let scorePopupTimeout, invalidCacheTimeout;

    useEffect(() => {
        return () => {
            clearTimeout(scorePopupTimeout);
            clearTimeout(invalidCacheTimeout);
        };
    }, []);

    const claimQuest = useCallback(async (questId) => {
        disableBtnSet(true);
        try {
            showScoreSet(true);
            scorePopupTimeout = setTimeout(() => {
                showScoreSet(false);
                clearTimeout(scorePopupTimeout);
            }, 500);

            invalidCacheTimeout = setTimeout(() => {
                queryClient.invalidateQueries("userQueryQuest");
                queryClient.invalidateQueries("userRewardQuery");
                disableBtnSet(false);
                clearTimeout(invalidCacheTimeout);
            }, 2000);
        } catch (error) {
            console.log(error);
            toast({
                title: "Exception",
                description: `Catch error at quest: ${quest.text}. Please contact admin.`,
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            disableBtnSet(false);
        }
    });

    const getClaimButton = useCallback(() => {
        if (!item) return null;
        const { isClaimed, isLocked } = item;

        if (isClaimed) {
            return (
                <Button flex="1" size={"md"} variant="ghost-base" disabled={true}>
                    Claimed
                </Button>
            );
        }
        if (!isClaimed && !isLocked) {
            return (
                <Button
                    flex="1"
                    size={"sm"}
                    variant="cyan"
                    transitionDuration={"0.5s"}
                    onClick={() => {}}
                >
                    Claim
                </Button>
            );
        }
        if (isLocked) {
            return (
                <Button flex="1" size={"md"} variant="ghost-base" disabled={true}>
                    Locked
                </Button>
            );
        }
    });

    return (
        <Box
            key={id}
            h={{ base: "112px", md: "96px" }}
            maxH={{ base: "112px", md: "96px" }}
            w="100%"
            bg="brand.neutral4"
            border="1px solid"
            borderColor={getColor(item)}
            borderRadius={"16px"}
            position="relative"
            display={"flex"}
            alignItems="center"
            justifyContent={"center"}
        >
            <Box display="flex" flex="1" h="100%">
                <Box
                    className="user-achievement-claim"
                    h="100%"
                    display="flex"
                    flexDirection={"row"}
                    flex="1"
                    px={{ base: "12px", md: "16px" }}
                    alignItems="center"
                >
                    <Box h="60%" display={"flex"} flex="1">
                        <Flex
                            flexDirection="row"
                            justifyContent={"space-between"}
                            flex="1"
                            alignItems="center"
                        >
                            <Flex display={"flex"} flexDirection="column" w="80%">
                                <>
                                    <HeadingSm color="#fff">{item.text}</HeadingSm>
                                    <TextSm
                                        fontWeight="400"
                                        color="whiteAlpha.700"
                                        // opacity="0.64"
                                        noOfLines={2}
                                    >
                                        {item.description}
                                    </TextSm>
                                </>
                            </Flex>
                            <Flex
                                position="relative"
                                h="100%"
                                alignItems={"center"}
                                maxWidth="20%"
                                minW="80px"
                                flex="1"
                            >
                                {getClaimButton()}
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const ComingSoonStrip = ({ isMobile, index }) => {
    return (
        <Box position={"relative"}>
            <Grid
                templateColumns={`${isMobile ? "1fr" : "1fr 3fr"}`}
                zIndex={"2"}
                position="relative"
                gap={`${isMobile ? "60px" : "0px"}`} //gap on mobile only vertical
            >
                <GridItem className="left-wrapper" position="relative">
                    <Box position={"relative"} h="100%" display={"flex"} alignItems="center">
                        {!isMobile && <DesktopHorizontalLine bg={"#2F4E6D"} />}
                        <Box
                            className="circle-wrapper"
                            w={`${isMobile ? "100%" : "50%"}`}
                            h="auto"
                            zIndex={"1"}
                            display={"flex"}
                            alignItems="center"
                            justifyContent={"center"}
                        >
                            <Flex
                                w="80%"
                                h="80%"
                                bg="brand.neutral5"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Circle stroke={"#2F4E6D"} />
                            </Flex>

                            <Box position="absolute" display={"flex"} justifyContent="center">
                                <Heading fontWeight="700" size="md" color={"#2F4E6D"}>
                                    {index}
                                </Heading>
                            </Box>
                        </Box>
                    </Box>
                </GridItem>

                <GridItem className="right-wrapper" zIndex={"1"}>
                    <ChakraBox
                        h={{ base: "112px", md: "96px" }}
                        maxH={{ base: "112px", md: "96px" }}
                        w="100%"
                        bg="brand.neutral4"
                        border="1px solid"
                        borderColor={"#2F4E6D"}
                        borderRadius={"16px"}
                    >
                        <Box display="flex" flex="1" h="100%">
                            <Box
                                className="user-achievement-claim"
                                h="100%"
                                display="flex"
                                flexDirection={"row"}
                                flex="1"
                                px={{ base: "12px", md: "16px" }}
                                alignItems="center"
                            >
                                <Box h="60%" display={"flex"} flex="1">
                                    <Flex
                                        flexDirection="row"
                                        justifyContent={"space-between"}
                                        flex="1"
                                        alignItems="center"
                                    >
                                        <Flex display={"flex"} flexDirection="column">
                                            <>
                                                <HeadingSm color="#fff">Coming Soon</HeadingSm>
                                                <TextSm
                                                    fontWeight="400"
                                                    color="whiteAlpha.700"
                                                    noOfLines={2}
                                                >
                                                    Finish the last achievements to reveal new
                                                    rewards!
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
    );
};

const DesktopHorizontalLine = ({ bg }) => {
    return (
        <Box
            className="horizontal-line"
            w="100%"
            position="absolute"
            display="flex"
            alignItems={"center"}
            justifyContent="center"
            zIndex={-1}
            left={`${"3rem"}`}
        >
            <Box w={`${"100%"}`} height={`${"1px"}`} bg={bg} />
        </Box>
    );
};

const DesktopVerticalLine = ({ index, achievementsArray, achievement }) => {
    return (
        <Box
            className="desktop-vertical-line"
            display={`${"block"}`}
            h="160px"
            position="absolute"
            left="39.5px"
            top="32px"
            w="1px"
            bg={index === achievementsArray.length - 1 ? "brand.neutral3" : getColor(achievement)}
            zIndex={"0"}
        />
    );
};

const MobileVerticalTop = ({ index, achievement }) => {
    return (
        <Box
            w="100%"
            className="mobile-middle-vertical-line-top"
            position="relative"
            display={`${"flex"}`}
            justifyContent="center"
            alignItems={"center"}
            zIndex={"-1"}
        >
            <Box
                h="160px"
                position="absolute"
                w="1px"
                bg={
                    index === achievementsArray.length - 1
                        ? "brand.neutral3"
                        : getColor(achievement)
                }
            />
        </Box>
    );
};

const MobileVerticalLineBottom = ({ index, achievementsArray, achievement }) => {
    return (
        <Box
            className="middle-vertical-line-below-circle"
            position="absolute"
            display={"flex"}
            justifyContent="center"
            zIndex={"-1"}
        >
            <Box
                h="120px"
                position="absolute"
                w="1px"
                bg={
                    index === achievementsArray.length - 1
                        ? "brand.neutral3"
                        : getColor(achievement)
                }
            />
        </Box>
    );
};
