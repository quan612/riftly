import React, { useEffect, useState, useCallback, useRef } from "react";

import Enums from "enums";
import { withUserQuestQuery } from "shared/HOC/quest";

import { isAlphabeticallly, isNotDoneFirst } from "@utils/sort";

import {
    useToast,
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
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Switch,
    Select,
    Checkbox,
    GridItem,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    Tooltip,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    Divider,
    ButtonGroup,
    Icon,
    Container,
} from "@chakra-ui/react";

import { AnimatePresence, AnimateSharedLayout, LayoutGroup } from "framer-motion";

import UserTierLevel from "./UserTierLevel";
import FeatureQuests from "./FeaturedQuests";
import ChallengeQuests from "./ChallengeQuests";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

const RiftlyIndividualQuestBoard = ({ session, userQuests }) => {
    const [currentQuests, setCurrentQuests] = useState([]);
    // const [featureQuests, featureQuestsSet] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const [featureQuests, featureQuestsSet] = useState([{ id: 1 }]);
    useEffect(async () => {
        handleRenderUserQuest();
    }, [userQuests]);

    /* @dev exclude Code Quest, Image Upload, Collaboration Quest, Some other quests related to Twitter
     */
    const handleRenderUserQuest = useCallback(async () => {
        if (userQuests && userQuests.length > 0) {
            let twitterAuthQuest = userQuests.find((q) => q.type.name === Enums.TWITTER_AUTH);
            // check if user has authenticated twitter, to show twitter related quests
            userQuests = userQuests.filter((q) => {
                if (
                    !twitterAuthQuest?.hasClaimed &&
                    (q.type.name === Enums.TWITTER_RETWEET || q.type.name === Enums.FOLLOW_TWITTER)
                ) {
                    return false;
                }

                return true;
            });

            // userQuests.sort(isAlphabeticallly);
            setCurrentQuests(userQuests);
        }
    }, [userQuests]);

    return (
        <Box
            minW={"100%"}
            w="100%"
            bg={"brand.neutral5"}
            color="#262626"
            borderTopRadius={"16px"}
            position="absolute"
            top={"160px"}
            zIndex="2"
            minH="auto"
            maxH="auto"
            pb="24px"
        >
            <Container
                position={"relative"}
                maxW="container.sm"
                minW={{ sm: "100%", md: "container.sm" }}
                padding={{ sm: "0px 16px", md: "0" }}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    w="100%"
                    position="relative"
                    top="-16px"
                    gap="16px"
                >
                    <AnimatePresence mode="sync">
                        <UserTierLevel session={session} key="user-tier" />
                        {featureQuests.length > 0 && (
                            <FeatureQuests
                                featureQuests={featureQuests}
                                featureQuestsSet={featureQuestsSet}
                                key="feature-section"
                            />
                        )}
                        <ChallengeQuests currentQuests={currentQuests} key="challenges-section" />
                        <ChakraBox
                            h="50px"
                            minH="50px"
                            bg="brand.neutral5"
                            key="challenges-layout-hack"
                            layout="position"
                        />
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
};

const firstHOC = RiftlyIndividualQuestBoard;
export default withUserQuestQuery(firstHOC);
