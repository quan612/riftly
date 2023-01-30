import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    Input,
} from "@chakra-ui/react";

import { ChakraBox, FramerButton } from "@theme/additions/framer/FramerChakraComponent";

const CLAIMABLE = 0;
const CLAIMED = 1;
const UNCLAIMABLE = 2;

import { CloseButton } from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useNftOwningQuestSubmit } from "@shared/HOC/quest";
import { RiftlyModalCloseButton } from "@components/riftly/Buttons";

const NftOwnerQuestModal = ({ isOpen, onClose, currentQuest }) => {
    const [nftQuestData, isSubmittingQuest, submit] = useNftOwningQuestSubmit();
    const [error, errorSet] = useState(null);
    const [currentView, setView] = useState(CLAIMABLE);

    async function onSubmitNftQuest() {
        const { questId } = currentQuest;
        let res = await submit({ questId });

        if (res.isError) {
            errorSet(res.message);
        } else {
            return setView(CLAIMED);
        }
    }

    const handleOnClose = () => {
        errorSet(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleOnClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                borderRadius="16px"
                bg="brand.neutral4"
                minH="35%"
                w="33%"
                maxW="container.sm"
                mt="16%"
                transition={"1.25s"}
            >
                <RiftlyModalCloseButton onClose={handleOnClose} />

                <ModalBody
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                    maxH={"100%"}
                >
                    <Flex
                        gap="16px"
                        direction="column"
                        alignItems={"center"}
                        justifyContent={"center"}
                        h="100%"
                        w="75%"
                        position={"relative"}
                    >
                        {currentView === CLAIMABLE && (
                            <AnimatePresence mode="popLayout">
                                <ChakraBox w="100%" layout key="nft-quest-heading">
                                    <Heading color="white" fontSize={"xl"} align="center">
                                        {currentQuest.text}
                                    </Heading>
                                </ChakraBox>
                                <ChakraBox w="100%" layout key="code-quest-text">
                                    <Text color="brand.neutral0" align="center" fontSize="md">
                                        {currentQuest.description}
                                    </Text>
                                </ChakraBox>

                                {error && (
                                    <ChakraBox
                                        layout
                                        color="red.300"
                                        key="nft-quest-error"
                                        exit={{ opacity: 0 }}
                                    >
                                        {error}
                                    </ChakraBox>
                                )}
                                <ChakraBox w="100%" key="nft-quest-submit" layout>
                                    <Button
                                        variant="blue"
                                        onClick={onSubmitNftQuest}
                                        minW="100%"
                                        borderRadius="24px"
                                        isLoading={isSubmittingQuest}
                                    >
                                        Submit
                                    </Button>
                                </ChakraBox>
                            </AnimatePresence>
                        )}
                        {currentView === CLAIMED && (
                            <>
                                <Image
                                    src="/img/user/riftly-success.gif"
                                    boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                                />

                                <Heading color="white" fontSize={"xl"} align="center" w="100%">
                                    Congrats!
                                </Heading>

                                <Text color="brand.neutral0" align="center" fontSize="md" w="100%">
                                    You own the Nft, return to challenges to claim your reward.
                                </Text>

                                <Button
                                    w="100%"
                                    variant="blue"
                                    onClick={handleOnClose}
                                    minW="100%"
                                    borderRadius="24px"
                                >
                                    Back to Challenges
                                </Button>
                            </>
                        )}
                        {currentView === UNCLAIMABLE && (
                            <AnimatePresence mode="popLayout">
                                <ChakraBox
                                    layout
                                    color="red.300"
                                    key="code-quest-error"
                                    exit={{ opacity: 0 }}
                                >
                                    {error}
                                </ChakraBox>
                                <Button
                                    variant="blue"
                                    onClick={handleOnClose}
                                    minW="100%"
                                    borderRadius="24px"
                                >
                                    Back to Challenges
                                </Button>
                            </AnimatePresence>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NftOwnerQuestModal;
