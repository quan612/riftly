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
} from "@chakra-ui/react";
import { HeadingLg, HeadingSm, TextSm } from "@components/riftly/Typography";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";
import { RiftlyIcon } from "../shared/riftly/RiftlyIcon";
import { AnimatePresence } from "framer-motion";

const RedeemRewards = () => {
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

                    <Box display={"flex"} position="relative" gap="16px" flexWrap={"wrap"}>
                        {pendingRewards.map((reward, index) => {
                            return (
                                <RewardCard
                                    image={"/img/user/feature-1.png"}
                                    reward={reward}
                                    key={reward.id}
                                    id={reward.id}
                                    onAction={onClaimReward}
                                />
                            );
                        })}
                    </Box>
                </ChakraBox>
            )}
        </AnimatePresence>
    );
};

export default RedeemRewards;

const RewardCard = ({ image, id, onAction }) => {
    return (
        <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="31%">
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
                <Flex flexDirection="column" justify="space-between" h="63%" py="4" px="4">
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
