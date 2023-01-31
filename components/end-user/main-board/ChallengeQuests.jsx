import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { useUserQuestClaim, useUserQuestSubmit } from "shared/HOC/quest";

import { useRouter } from "next/router";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    useDisclosure,
    Divider,
    ButtonGroup,
    Icon,
    Container,
    useToast,
} from "@chakra-ui/react";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

import { AnimatePresence, motion, AnimateSharedLayout, LayoutGroup } from "framer-motion";
import { useQueryClient } from "react-query";
import { RiftlyIcon } from "../shared/riftly/RiftlyIcon";
import CodeQuestModal from "../shared/riftly/CodeQuestModal";
import { doQuestUtility } from "../shared/doQuestUtility";
import WalletAuthQuestModal from "../shared/riftly/WalletAuthQuestModal";
import NftOwnerQuestModal from "../shared/riftly/NftOwnerQuestModal";
import { HeadingLg, HeadingSm, TextSm } from "@components/riftly/Typography";

const ChallengeQuests = ({ currentQuests }) => {
    const [filterCompleted, filterCompletedSet] = useState(false);
    const trackFirstRender = useRef(true);
    const [newQuests, newQuestsSet] = useState([]);
    const [completedQuests, completedQuestsSet] = useState([]);
    useEffect(() => {
        if (currentQuests) {
            // trackFirstRender.current = false;
            let completed = currentQuests.filter((q) => q.hasClaimed === true);
            completedQuestsSet(completed);
            let newQ = currentQuests.filter((q) => q.hasClaimed === false);
            newQuestsSet(newQ);
        }
    }, [currentQuests, filterCompleted]);

    return (
        <ChakraBox
            display="flex"
            flexDirection={"column"}
            gap={"16px"}
            position={"relative"}
            minH="auto"
            // layout="position"

            // h="900px"
            // layout
        >
            <ChallengesHeader
                filterCompleted={filterCompleted}
                filterCompletedSet={filterCompletedSet}
            />

            <Box h="auto" display={"flex"} flexDirection={"column"} gap={"16px"}>
                {currentQuests
                    .filter((q) => {
                        if (filterCompleted) {
                            return q.hasClaimed === true;
                        } else {
                            return q.hasClaimed === false;
                        }
                    })
                    .map((quest, index) => {
                        return (
                            <ChakraBox
                                key={quest.id}
                                h={{ base: "112px", md: "96px" }}
                                maxH={{ base: "112px", md: "96px" }}
                                w="100%"
                                bg="brand.neutral4"
                                border="1px solid"
                                borderColor="brand.neutral3"
                                borderRadius={"16px"}
                            >
                                <Box display="flex" flexDirection={"row"} w="100%">
                                    <UserQuestBox
                                        quest={quest}
                                        index={index}
                                        key={index}
                                        currentQuests={currentQuests}
                                        filterCompleted={filterCompleted}
                                    />
                                </Box>
                            </ChakraBox>
                        );
                    })}

                {/* {!filterCompleted &&
                    newQuests.map((quest, index) => {
                        return (
                            <Box
                                key={quest.id}
                                h={{ base: "112px", md: "96px" }}
                                maxH={{ base: "112px", md: "96px" }}
                                w="100%"
                                bg="brand.neutral4"
                                border="1px solid"
                                borderColor="brand.neutral3"
                                borderRadius={"16px"}
                            >
                                <Box display="flex" flexDirection={"row"} w="100%">
                                    <UserQuestBox
                                        quest={quest}
                                        index={index}
                                        key={index}
                                        currentQuests={currentQuests}
                                        filterCompleted={filterCompleted}
                                    />
                                </Box>
                            </Box>
                        );
                    })}

                {filterCompleted &&
                    completedQuests.map((quest, index) => {
                        return (
                            <ChakraBox
                                key={quest.id}
                                h={{ base: "112px", md: "96px" }}
                                maxH={{ base: "112px", md: "96px" }}
                                w="100%"
                                bg="brand.neutral4"
                                border="1px solid"
                                borderColor="brand.neutral3"
                                borderRadius={"16px"}
                            >
                                <Box display="flex" flexDirection={"row"} w="100%">
                                    <UserQuestBox
                                        quest={quest}
                                        index={index}
                                        key={index}
                                        currentQuests={currentQuests}
                                        filterCompleted={filterCompleted}
                                    />
                                </Box>
                            </ChakraBox>
                        );
                    })} */}
            </Box>
        </ChakraBox>
    );
};

export default ChallengeQuests;

const ChallengesHeader = ({ filterCompleted, filterCompletedSet }) => {
    return (
        <ChakraBox
            display={"flex"}
            justifyContent="space-between"
            // layout="position"
        >
            <Heading color="white" fontWeight="600" size="md">
                Challenges
            </Heading>
            <Box display={"flex"} align="end">
                <Box
                    display={"flex"}
                    flexDirection="row"
                    border={"1px solid"}
                    bg="brand.neutral4"
                    p="3px"
                    w="200px"
                    h="32px"
                    borderRadius="48px"
                >
                    <Flex
                        w="100%"
                        justifyContent={filterCompleted ? "flex-end" : "flex-start"}
                        onClick={() => filterCompletedSet(!filterCompleted)}
                        alignItems="center"
                        position="relative"
                    >
                        <ChakraBox
                            layout="position"
                            // layout
                            // layoutId="challenges-filter"
                            w="50%"
                            h="100%"
                            bg="brand.neutral3"
                            borderRadius="48px"
                        />
                        <Box
                            h="100%"
                            w="50%"
                            position={"absolute"}
                            top="0"
                            left="0"
                            alignItems={"center"}
                            display="flex"
                            _hover={{
                                cursor: "pointer",
                            }}
                        >
                            <Text
                                transitionDuration="1s"
                                color={!filterCompleted ? "white" : "whiteAlpha.500"}
                                w="100%"
                                align={"center"}
                                fontSize="xs"
                            >
                                New
                            </Text>
                        </Box>
                        <Box
                            h="100%"
                            w="50%"
                            position={"absolute"}
                            top="0"
                            right="0"
                            alignItems={"center"}
                            display="flex"
                            _hover={{
                                cursor: "pointer",
                            }}
                        >
                            <Text
                                transitionDuration="1s"
                                color={filterCompleted ? "white" : "whiteAlpha.500"}
                                w="100%"
                                align={"center"}
                                fontSize="xs"
                            >
                                Completed
                            </Text>
                        </Box>
                        {/* </AnimateSharedLayout> */}
                    </Flex>
                </Box>
            </Box>
        </ChakraBox>
    );
};

const UserQuestBox = ({ quest, index, currentQuests, filterCompleted, onTest }) => {
    let router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();

    const [submitQuestData, isSubmittingQuest, onSubmit] = useUserQuestSubmit();
    const [claimUserQuestData, isClaimingUserQuest, onClaim] = useUserQuestClaim();

    const [disableBtn, disableBtnSet] = useState(false);

    const [showScore, showScoreSet] = useState(false);
    let scorePopupTimeout, invalidCacheTimeout;

    const codeQuestModal = useDisclosure();
    const codeQuestRef = useRef({});

    const walletAuthQuestModal = useDisclosure();
    const walletAuthQuestRef = useRef({});

    const nftOwnQuestModal = useDisclosure();
    const nftOwnQuestRef = useRef({});

    useEffect(() => {
        return () => {
            clearTimeout(scorePopupTimeout);
            clearTimeout(invalidCacheTimeout);
        };
    }, []);

    const doQuest = useCallback(
        async (quest) => {
            try {
                switch (quest.type.name) {
                    case Enums.CODE_QUEST:
                        codeQuestRef.current = quest;
                        codeQuestModal.onOpen();
                        break;
                    case Enums.WALLET_AUTH:
                        walletAuthQuestRef.current = quest;
                        walletAuthQuestModal.onOpen();
                        break;
                    case Enums.OWNING_NFT_CLAIM:
                        nftOwnQuestRef.current = quest;
                        nftOwnQuestModal.onOpen();
                        break;
                    default:
                        await doQuestUtility(router, quest, currentQuests, onSubmit);
                }
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
            }
        },
        [currentQuests]
    );

    const claimQuest = useCallback(async (questId) => {
        disableBtnSet(true);
        try {
            let res = await onClaim({ questId });
            if (res.isError) {
                console.log(res.message);
                throw res.message;
            }
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

            //
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

    return (
        <>
            <Box
                className="reward-quantity-per-quest"
                w="96px"
                h={{ base: "112px", md: "96px" }}
                borderRight={"1px solid"}
                borderRightColor={"brand.neutral3"}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    h="60%"
                    display="flex"
                    flexDirection={"column"}
                    justifyContent="space-evenly"
                    alignItems={"center"}
                >
                    <Box maxH="36px" h="33%" position={"relative"} boxSize="20px">
                        <RiftlyIcon fill={filterCompleted ? "#132436" : "#1D63FF"} />
                    </Box>
                    <HeadingLg color={filterCompleted ? "whiteAlpha.400" : "#fff"}>
                        {quest.quantity}
                    </HeadingLg>
                </Box>
            </Box>

            <Box display="flex" flex="1">
                <Box
                    className="user-quest-claim"
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
                                {!filterCompleted && (
                                    <>
                                        <HeadingSm color="#fff" noOfLines={2}>
                                            {quest.text}
                                        </HeadingSm>
                                        <TextSm color="whiteAlpha.700" opacity={0.64} noOfLines={2}>
                                            {quest.description}
                                        </TextSm>
                                    </>
                                )}
                                {filterCompleted && (
                                    <>
                                        <HeadingSm color="whiteAlpha.400">{quest.text}</HeadingSm>
                                        <TextSm color="whiteAlpha.400" noOfLines={2}>
                                            {quest.description}
                                        </TextSm>
                                    </>
                                )}
                            </Flex>
                            <Flex position="relative" h="100%" alignItems={"center"}>
                                {filterCompleted && (
                                    <Text
                                        color="brand.neutral0"
                                        opacity={0.4}
                                        fontWeight="600"
                                        fontSize={{ base: "sm", md: "md" }}
                                    >
                                        Completed
                                    </Text>
                                )}
                                {!filterCompleted && (
                                    <AnimatePresence>
                                        {showScore && (
                                            <ChakraBox
                                                key={quest.id}
                                                position={"absolute"}
                                                top="-3"
                                                left="4"
                                                variants={{
                                                    hidden: {
                                                        opacity: 0,
                                                        y: 20,
                                                    },
                                                    visible: {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: {
                                                            duration: 1,
                                                            type: "spring",
                                                        },
                                                    },
                                                    removed: {
                                                        opacity: 0,

                                                        transition: {
                                                            duration: 2,
                                                            // type: "spring",
                                                        },
                                                    },
                                                }}
                                                initial="hidden"
                                                animate="visible"
                                                exit="removed"
                                            >
                                                <Text
                                                    className="score"
                                                    size="xl"
                                                    color="brand.cyan"
                                                    fontWeight={"700"}
                                                >
                                                    + {quest.quantity}
                                                </Text>
                                            </ChakraBox>
                                        )}
                                        <Button
                                            size={"sm"}
                                            variant={quest.isClaimable ? "cyan" : "blue"}
                                            transitionDuration={"0.5s"}
                                            onClick={() => {
                                                if (!quest.isClaimable) {
                                                    doQuest(quest);
                                                } else {
                                                    const { questId } = quest;
                                                    claimQuest(questId);
                                                }
                                            }}
                                            isLoading={isSubmittingQuest || isClaimingUserQuest}
                                            disabled={disableBtn}
                                        >
                                            {quest.isClaimable ? "Claim" : "Start"}
                                        </Button>
                                    </AnimatePresence>
                                )}
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            </Box>
            {codeQuestRef?.current && (
                <CodeQuestModal
                    isOpen={codeQuestModal.isOpen}
                    onClose={() => {
                        codeQuestRef.current = {};
                        codeQuestModal.onClose();
                    }}
                    currentQuest={codeQuestRef.current}
                />
            )}
            {walletAuthQuestRef?.current && (
                <WalletAuthQuestModal
                    isOpen={walletAuthQuestModal.isOpen}
                    onClose={() => {
                        walletAuthQuestRef.current = {};
                        walletAuthQuestModal.onClose();
                    }}
                />
            )}
            {nftOwnQuestRef?.current && (
                <NftOwnerQuestModal
                    isOpen={nftOwnQuestModal.isOpen}
                    onClose={() => {
                        nftOwnQuestRef.current = {};
                        nftOwnQuestModal.onClose();
                    }}
                    currentQuest={nftOwnQuestRef.current}
                />
            )}
        </>
    );
};

// const UnderlinedMenu = () => {
//     const [selected, setSelected] = useState(0);
//     return (
//         <div className="underlined-menu">
//             <Box display={"flex"} flexDirection="row" justifyContent={"space-evenly"}>
//                 <AnimateSharedLayout>
//                     {menuItems.map((el, i) => (
//                         <MenuItem
//                             text={el}
//                             key={i}
//                             selected={selected === i}
//                             onClick={() => setSelected(i)}
//                         />
//                     ))}
//                 </AnimateSharedLayout>
//             </Box>
//         </div>
//     );
// };

// const menuItems = ["Lorem", "ipsum", "dolor", "sit"];
// const MenuItem = ({ text, selected, onClick }) => (
//     <motion.div
//         onClick={onClick}
//         animate={{ opacity: selected ? 1 : 0.5 }}
//         style={{ color: "white", position: "relative" }}
//     >
//         {text}
//         {selected && (
//             <motion.div
//                 layoutId="underline"
//                 style={{
//                     position: "absolute",
//                     top: "100%",
//                     left: "0",
//                     width: "100%",
//                     height: "4px",
//                     background: "white",
//                     borderRadius: "15px",
//                 }}
//             />
//         )}
//     </motion.div>
// );
