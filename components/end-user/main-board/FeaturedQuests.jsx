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

const FeatureQuests = ({ featureQuests, featureQuestsSet }) => {
    const onDoFeatureQuest = (id) => {
        let filterQuest = featureQuests.filter((q) => q.id !== id);
        featureQuestsSet(filterQuest);
    };
    return (
        <ChakraBox
            display="flex"
            flexDirection={"column"}
            gap={"16px"}
            exit={{ opacity: 0 }}
            // transition={{ type: "spring" }}
            // layout="position"
            layout
        >
            <Heading color="white" fontWeight="600" size="md">
                Featured
            </Heading>
            {/* <Box minW="100%"> */}
            {/* <SimpleGrid columns={{ base: 3 }} gap="16px" w="100%">
               
                    {featureQuests.map((quest, index) => {
                        return (
                            <FeatureCard
                                image={"/img/user/feature-1.png"}
                                quest={quest}
                                key={quest.id}
                                doFeatureQuest={onDoFeatureQuest}
                            />
                        );
                    })}
               
                </SimpleGrid> */}

            <Box display={"flex"} overflow={"auto"} position="relative" gap="16px">
                {featureQuests.map((quest, index) => {
                    return (
                        <FeatureCard
                            image={"/img/user/feature-1.png"}
                            quest={quest}
                            key={quest.id}
                            doFeatureQuest={onDoFeatureQuest}
                        />
                        // <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" minW="200px"></Box>
                    );
                })}
            </Box>

            {/* </Box> */}
        </ChakraBox>
    );
};

export default FeatureQuests;

const FeatureCard = ({ image, quest, doFeatureQuest }) => {
    return (
        <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" w="200px">
            {/* <Flex direction={{ base: "column" }}>
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
                    <Footer doFeatureQuest={doFeatureQuest} />
                </Flex>
            </Flex> */}
        </Box>
    );
};

const Body = ({ quest }) => {
    return (
        <Flex justify="space-between">
            <Flex direction="column" gap="5px">
                <HeadingSm color={"white"} fontWeight="bold">
                    Daily Reward
                </HeadingSm>

                <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400">
                    Sign in every day for more rewards!
                </TextSm>
            </Flex>
        </Flex>
    );
};

const Footer = ({ doFeatureQuest }) => {
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
                onClick={() => doFeatureQuest(1)}
            >
                Claim
            </Button>
        </Flex>
    );
};
