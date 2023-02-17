import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Heading,
    Box,
    Flex,
    Button,
    useColorMode,
    useColorModeValue,
    SimpleGrid,
    Image,
} from "@chakra-ui/react";
import { HeadingLg, HeadingSm, TextSm } from "@components/riftly/Typography";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

import { AnimatePresence } from "framer-motion";
import { RiftlyIcon } from "@components/riftly/Icons";

const FeatureQuests = () => {
    const [featureQuests, featureQuestsSet] = useState([{ id: 1 }]);
    const onDoFeatureQuest = (key) => {
        let filterQuest = featureQuests.filter((q) => q.id !== key);
        featureQuestsSet(filterQuest);
    };
    return (
        <AnimatePresence>
            {featureQuests.length > 0 && (
                <ChakraBox
                    display="flex"
                    flexDirection={"column"}
                    // initial={{ opacity: 0 }}
                    // animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    gap={"16px"}
                >
                    <Heading color="white" fontWeight="600" size="md">
                        Featured
                    </Heading>

                    <Box
                        display={"flex"}
                        overflowX={"auto"}
                        position="relative"
                        gap="16px"
                        overflowY={"none"}
                    >
                        {featureQuests.map((quest, index) => {
                            return (
                                <FeatureCard
                                    image={"/img/user/feature-1.png"}
                                    quest={quest}
                                    key={quest.id}
                                    id={quest.id}
                                    doFeatureQuest={onDoFeatureQuest}
                                />
                                // <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" minW="200px"></Box>
                            );
                        })}
                    </Box>
                </ChakraBox>
            )}
        </AnimatePresence>
    );
};

export default FeatureQuests;

const FeatureCard = ({ image, id, doFeatureQuest }) => {
    return (
        <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="33%">
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
                    <Footer id={id} doFeatureQuest={doFeatureQuest} />
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

const Footer = ({ id, doFeatureQuest }) => {
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
                onClick={() => doFeatureQuest(id)}
            >
                Test
            </Button>
        </Flex>
    );
};
