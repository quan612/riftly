import React, { useEffect, useState, useCallback, useRef } from "react";
import { Image, useToast } from "@chakra-ui/react";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    useDisclosure,
    chakra,
    shouldForwardProp,
} from "@chakra-ui/react";

import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

import { useUserRewardQuery } from "@shared/HOC";
import { shortenAddress } from "@utils/shortenAddress";
import { RiftlyIcon } from "../shared/riftly/RiftlyIcon";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";
import { HeadingSm, TextMd } from "@components/riftly/Typography";

function getPoints(level) {
    // return 20 * level * (level + 4);
    return ((Math.pow(level, 2) + level) / 2) * 100 - level * 100;
}

function getLevel(points) {
    let level = (Math.sqrt(100 * (2 * points + 25)) + 50) / 100;
    return Math.floor(level);
}

const UserTierLevel = ({ session }) => {
    const [userRewards, userRewardLoading] = useUserRewardQuery(session);
    const [levelProgress, levelProgressSet] = useState(0);
    const [tier, tierSet] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    let levelUpTimeout;

    const test = (val) => {
        let newVal = levelProgress + val;
        if (newVal > 100) {
            newVal = newVal % 100;
            levelProgressSet(100);
            let timeout = setTimeout(() => {
                onOpen();
                levelProgressSet(newVal);
                clearTimeout(timeout);
            }, 350);
        } else {
            levelProgressSet(newVal);
        }
    };

    useEffect(() => {
        return () => {
            clearTimeout(levelUpTimeout);
        };
    }, []);

    useEffect(() => {
        if (userRewards && userRewards.length > 0) {
            let currentReward = userRewards[0];
            if (!tier) {
                let currentPoint = currentReward.quantity;
                let currentLevel = getLevel(currentPoint);
                let currentLevelPoint = getPoints(currentLevel);
                let nextLevelPoint = getPoints(currentLevel + 1);
                console.log(currentLevelPoint);
                console.log(currentPoint);
                console.log(nextLevelPoint);
                let progress =
                    ((currentPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) *
                    100;

                console.log(progress);
                let newTier = {
                    currentLevel,
                    nextLevel: currentLevel + 1,
                    currentPoint,
                };
                levelProgressSet(progress);
                tierSet((prev) => newTier);

                return;
            }

            let newPoint = currentReward.quantity;
            let currentLevel = getLevel(tier.currentPoint);
            let currentLevelPoint = getPoints(currentLevel);
            let nextLevelPoint = getPoints(currentLevel + 1);
            let progress =
                ((newPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) * 100;

            console.log(currentLevelPoint);
            console.log(newPoint);
            console.log(nextLevelPoint);

            let newTier;
            if (newPoint > nextLevelPoint) {
                levelProgressSet(100);

                levelUpTimeout = setTimeout(() => {
                    onOpen();

                    let currentLevelPoint = getPoints(currentLevel + 1);
                    let nextLevelPoint = getPoints(tier.currentLevel + 2);
                    let newProgress =
                        ((newPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) *
                        100;
                    levelProgressSet(newProgress);

                    newTier = {
                        currentLevel: currentLevel + 1,
                        nextLevel: currentLevel + 2,
                        currentPoint: newPoint,
                    };
                    tierSet(newTier);
                    clearTimeout(levelUpTimeout);
                }, 1350);
            } else {
                levelProgressSet(progress);
                newTier = {
                    currentLevel: currentLevel,
                    nextLevel: currentLevel + 1,
                    currentPoint: newPoint,
                };
                tierSet(newTier);
            }
        }
    }, [userRewards]);

    const getUserName = useCallback((session) => {
        switch (session.provider) {
            case "discord":
                return session?.profile?.username + "#" + session?.profile?.discriminator;
            case "twitter":
                return session?.profile?.data?.username;
            case "unstoppable-authenticate":
                return session?.user?.uauthUser;
            case "email":
                return session?.user?.email;
            default:
                if (session?.user?.address.length > 16)
                    return shortenAddress(session?.user?.address);
                return ""; //session?.user?.wallet || shortenAddress(session?.user?.address);
        }
    });

    return (
        <ChakraBox
            minW="100%"
            bg={"brand.neutral4"}
            minH="128px"
            // h="11.21%"
            h="100%"
            border="1px solid"
            borderRadius={"16px"}
            borderColor="brand.neutral3"
            position={"relative"}
            display="flex"
            // layout="position"
        >
            <Box
                display={"flex"}
                alignItems={"center"}
                minH="100%"
                flex="1"
                // onClick={test}
                // onClick={() => test(35)}
            >
                <UserTierAvatar />

                <Box display="flex" flex="1" h="100%" alignItems="center" justifyContent={"center"}>
                    <Flex className="user-quest-info" h="70%" display="flex" flex="1" px="2px">
                        <Box
                            display={"flex"}
                            h={"100%"}
                            flexDirection="column"
                            flex="1"
                            pe="24px"
                            justifyContent={"space-evenly"}
                        >
                            <Flex flexDirection="row" flex="1" alignItems="center">
                                <Flex
                                    display={"flex"}
                                    flex="1"
                                    flexDirection="column"
                                    justifyContent={"center"}
                                    h="100%"
                                >
                                    <HeadingSm color="#fff" fontWeight="700" size="md">
                                        {getUserName(session)}
                                    </HeadingSm>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        gap="8px"
                                        alignItems="center"
                                        h={"auto"}
                                    >
                                        <Box
                                            maxH="24px"
                                            h="33%"
                                            position={"relative"}
                                            boxSize="14px"
                                        >
                                            <RiftlyIcon fill={"#1D63FF"} />
                                        </Box>

                                        <TextMd as="span" color="whiteAlpha.700" opacity="0.64">
                                            {/* {tier && tier.currentPoint} Reward Points */}
                                            {userRewards?.length > 0 &&
                                                userRewards[0].quantity + " "}
                                            Reward Points
                                        </TextMd>
                                    </Box>
                                </Flex>

                                <Box boxSize={"48px"}>
                                    <Flex
                                        justifyContent={"center"}
                                        alignItems="center"
                                        flex="1"
                                        h="100%"
                                        w="100%"
                                        position={"relative"}
                                    >
                                        <svg
                                            style={{ position: "absolute" }}
                                            width="48"
                                            height="48"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="21.5"
                                                // fill="#132436"
                                                stroke="url(#paint0_linear_13425_1016)"
                                                strokeWidth="5"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_13425_1016"
                                                    x1="7.25581"
                                                    y1="-3.90698"
                                                    x2="39.0698"
                                                    y2="48"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#1D63FF" />
                                                    <stop offset="1" stopColor="#00BBC7" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <Heading fontWeight="700" size="lg" color="#fff">
                                            {tier && tier.currentLevel}
                                            {/* 5 */}
                                        </Heading>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Flex flex="1" maxH="16px">
                                <Box
                                    pos={"relative"}
                                    w="100%"
                                    overflow={"hidden"}
                                    bg="brand.neutral5"
                                    borderRadius={"16px"}
                                >
                                    <ChakraBox
                                        initial={{
                                            width: `${levelProgress}%`,
                                        }}
                                        animate={{
                                            width: `${levelProgress}%`,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 67,
                                            damping: 15,
                                            restDelta: 0.001,
                                            mass: 0.75,
                                        }}
                                        bg="brand.blue"
                                        borderRadius={"16px"}
                                        position={"absolute"}
                                        top="0"
                                        h="100%"
                                    ></ChakraBox>
                                    <Text
                                        position={"absolute"}
                                        fontSize="xs"
                                        color="whiteAlpha.500"
                                        top="0"
                                        left="4px"
                                    >
                                        TIER {tier && tier.currentLevel}
                                    </Text>
                                    <Text
                                        position={"absolute"}
                                        fontSize="xs"
                                        color="whiteAlpha.500"
                                        top="0"
                                        right="4px"
                                    >
                                        TIER {tier && tier.nextLevel}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <LevelUpModal tier={tier} isOpen={isOpen} onClose={onClose} />
        </ChakraBox>
    );
};

export default UserTierLevel;

const LevelUpModal = ({ tier, isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bg="brand.neutral3"
                h="35%"
                w="33%"
                maxH={"429px"}
                maxW="container.sm"
                borderRadius="24px"
                mt="16%"
                transition={"1.25s"}
            >
                <ModalBody
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                >
                    <Flex
                        gap="16px"
                        direction="column"
                        alignItems={"center"}
                        justifyContent={"center"}
                        h="100%"
                        w="80%"
                        position={"relative"}
                    >
                        <Box
                            position={"absolute"}
                            top="0"
                            left="0"
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            w="100%"
                            h="65%"
                            zIndex={3}
                        >
                            <Image
                                src={"/img/user/Level Up_Confetti.gif"}
                                w="70%"
                                // h={{ base: "100%" }}
                                // borderTopRadius="16px"
                                fit={"fill"}
                            />
                        </Box>
                        <ChakraBox
                            display={"flex"}
                            w="100%"
                            minH={"84px"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            position={"relative"}
                        >
                            <Flex
                                justifyContent={"center"}
                                alignItems="center"
                                flex="1"
                                position={"relative"}
                                height="100%"
                            >
                                <motion.svg
                                    style={{ position: "absolute" }}
                                    top="0"
                                    left="0"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        ease: "linear",
                                        duration: 1.5,
                                    }}
                                    width="84px"
                                    height="84px"
                                    viewBox="0 0 84 84"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="42"
                                        cy="42"
                                        r="38"
                                        fill="#132436"
                                        stroke="url(#paint0_linear_13425_1016)"
                                        strokeWidth="7.5"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="paint0_linear_13425_1016"
                                            x1="7.25581"
                                            y1="-3.90698"
                                            x2="39.0698"
                                            y2="48"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#1D63FF" />
                                            <stop offset="1" stopColor="#00BBC7" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>

                                <Text
                                    fontWeight="700"
                                    fontSize="2.25rem"
                                    textShadow="0px 0px 15px #fff"
                                    color="white"
                                    zIndex={"2"}
                                >
                                    {tier && tier.currentLevel}
                                </Text>
                            </Flex>
                        </ChakraBox>

                        <Heading color="white" fontSize={"2xl"}>
                            You leveled up 🎉
                        </Heading>
                        <Text color="brand.neutral0" align="center">
                            Congrats! You are now at{" "}
                            <Text as="span" color="brand.cyan">
                                Tier {tier && tier.currentLevel}
                            </Text>
                            . Continue your adventure and earn more rewards!
                        </Text>
                        <Button
                            variant="blue"
                            mr={3}
                            onClick={onClose}
                            minW="75%"
                            borderRadius="24px"
                        >
                            Back to Challenges
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const UserTierAvatar = () => {
    return (
        <Box
            className="quest-user-avatar"
            minW="128px"
            h="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={"0 0 auto"}
        >
            <Box
                h="80%"
                display="flex"
                flexDirection={"column"}
                justifyContent="space-evenly"
                alignItems={"center"}
            >
                <Image
                    borderRadius="full"
                    boxSize="72px"
                    src="https://bit.ly/dan-abramov"
                    alt="Dan Abramov"
                />
            </Box>
        </Box>
    );
};
