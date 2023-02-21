import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Heading,
    Box,
    Flex,
    Link,
    List,
    ListItem,
    Text,
    Button,
    useColorMode,
    useColorModeValue,
    SimpleGrid,
    Image,
    Grid,
} from "@chakra-ui/react";
import { HeadingLg, HeadingSm, TextSm } from "@components/riftly/Typography";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

import { AnimatePresence } from "framer-motion";
import { RiftlyIcon } from "@components/riftly/Icons";
let isMobile = true;
const RedeemRewardsPage = ({ session }) => {
    const [pendingRewards, pendingRewardsSet] = useState([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
    ]);
    const onClaimReward = (key) => {
        let filterRewards = pendingRewards.filter((q) => q.id !== key);
        pendingRewardsSet(filterRewards);
    };
    return (
        <>
            <ChakraBox
                position={"relative"}
                h={"128px"}
                maxH="128px"
                key="balance-info"
                exit={{ opacity: 0, transition: { duration: 0.65 } }}
            >
                <BalanceInfo session={session} />
            </ChakraBox>
            <AnimatePresence>
                {pendingRewards.length > 0 && (
                    <ChakraBox
                        display="flex"
                        flexDirection={"column"}
                        exit={{ opacity: 0, transition: { duration: 0.65 } }}
                        gap={"16px"}
                    >
                        <Heading color="white" fontWeight="600" size="md">
                            Redeem Rewards
                        </Heading>

                        {/* <Box display={"flex"} position="relative" gap="16px" flexWrap={"wrap"}> */}

                        <Flex
                            // gridTemplate={`${isMobile ? "1fr 1fr / 1fr 1fr" : "1fr 1fr / 1fr 1fr"}`}
                            // templateColumns={`${isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)"}`}
                            className="wrapper"
                            gap={"24px"}
                            alignItems="center"
                            justifyContent={"space-between"}
                            alignSelf="center"
                            w="100%"
                            flexWrap={"wrap"}
                        >
                            {pendingRewards.map((reward, index) => {
                                return (
                                    <Flex
                                        // alignItems={"center"}
                                        // justifyContent="center"
                                        w={`${isMobile ? "46%" : "30%"}`}
                                        // minW="30%"
                                        justifyContent="center"
                                        className="redeem-card-wrapper"
                                    >
                                        <RewardCard
                                            image={"/img/user/feature-1.png"}
                                            reward={reward}
                                            key={reward.id}
                                            id={reward.id}
                                            onAction={onClaimReward}
                                        />
                                    </Flex>
                                );
                            })}
                        </Flex>
                        {/* </Box> */}
                    </ChakraBox>
                )}
            </AnimatePresence>
        </>
    );
};

export default RedeemRewardsPage;

const BalanceInfo = () => {
    return (
        <ChakraBox
            minW="100%"
            minH="128px"
            h="100%"
            position={"absolute"}
            display="flex"
            justifyContent={"center"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, zIndex: 1 }}
            exit={{ opacity: 0, zIndex: 0 }}
        >
            <Box
                display={"flex"}
                alignItems={"center"}
                minH="100%"
                w="50%"
                bg={"brand.blue"}
                borderRadius="16px"
            >
                <Box
                    display="flex"
                    flex="1"
                    h="80%"
                    maxH={"80%"}
                    alignItems="center"
                    justifyContent={"space-evenly"}
                    flexDirection="column"
                >
                    <Heading size="sm" color="#fff">
                        Available Balance
                    </Heading>
                    <Flex gap="16px" alignItems="center">
                        <Box maxH="24px" h="33%" position={"relative"} boxSize="24px">
                            <RiftlyIcon fill={"#fff"} />
                        </Box>
                        <Heading size="lg" color="#fff">
                            3,200
                        </Heading>
                    </Flex>
                </Box>
            </Box>
        </ChakraBox>
    );
};

const RewardCard = ({ image, id, onAction }) => {
    return (
        <Box
            bg={"brand.neutral4"}
            borderRadius="16px"
            // h="259px"
            w="100%"
            // minW="200px"
            maxW="200px"
            className="redeem-card"
            display={"flex"}
            // minH="100%"
            // minW="120px"
            // maxW={`${isMobile ? "50%" : "32%"}`}
        >
            <Flex direction={{ base: "column" }} h="100%">
                <Box position="relative" h="37%" minH={"37%"} maxH="37%!important">
                    <Image
                        boxSize={"100px"}
                        src={image}
                        w={{ base: "100%", "3xl": "100%" }}
                        borderTopRadius="16px"
                        fit={"fill"}
                    />
                </Box>
                <Flex flexDirection="column" justify="space-between" h="63%" py="4" px="4" w="100%">
                    <Body />
                    <Footer id={id} onAction={onAction} />
                </Flex>
            </Flex>
        </Box>
    );
};

const Body = ({ quest }) => {
    return (
        <Flex justify="space-between">
            <Flex direction="column" gap="5px">
                <HeadingSm color={"white"} fontWeight="bold">
                    Place Holder
                </HeadingSm>

                <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400">
                    A Very long Place Holder Text Description......
                </TextSm>
            </Flex>
        </Flex>
    );
};

const Footer = ({ id, onAction }) => {
    return (
        <Flex align="start" alignItems={"center"} justify="space-between" mt="25px">
            <Flex alignItems={"center"} gap="5px">
                <Box maxH="24px" h="33%" position={"relative"} boxSize="16px">
                    <RiftlyIcon fill={"#1D63FF"} />
                </Box>
                <HeadingLg fontWeight="700" color={"white"}>
                    30
                </HeadingLg>
            </Flex>

            <Button
                bg="brand.cyan"
                color="white"
                fontSize="md"
                fontWeight="600"
                borderRadius="48px"
                px="24px"
                py="5px"
                onClick={() => onAction(id)}
            >
                Redeem
            </Button>
        </Flex>
    );
};
