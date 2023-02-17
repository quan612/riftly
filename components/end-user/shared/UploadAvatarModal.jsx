import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heading, Text, Button, Image, Input, ButtonGroup } from "@chakra-ui/react";

import { ChakraBox, FramerButton } from "@theme/additions/framer/FramerChakraComponent";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useCodeQuestSubmit } from "@shared/HOC/quest";
import { RiftlyModalCloseButton } from "@components/riftly/Buttons";
import { debounce } from "@utils/index";
import ModalWrapper from "../wrappers/ModalWrapper";
import axios from "axios";

const UPLOADABLE = 0;
const SUBMITTABLE = 1;
const SUBMITTED = 2;
const ERROR = 3;

const UploadAvatarModal = ({ isOpen, onClose }) => {
    // const [codeQuestData, isSubmittingQuest, submit] = useCodeQuestSubmit();
    const [currentView, setView] = useState(UPLOADABLE);
    const [error, errorSet] = useState(null);
    const [imageSrc, setImageSrc] = useState();
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const hiddenFileInput = useRef(null);
    const imageEl = useRef(null);
    function handleOnChange(changeEvent) {
        const reader = new FileReader();
        errorSet(null);
        if (changeEvent.target.files[0].size > 1024 * 1024) {
            errorSet("File is too big, please try again");
            // setView(ERROR);
            return;
        }

        reader.onload = function (onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
        };

        reader.readAsDataURL(changeEvent.target.files[0]);
        setImageFile(changeEvent.target.files[0]);
        setView(SUBMITTABLE);
    }

    const handleOnClose = () => {
        errorSet(null);
        onClose();
    };

    const handleOnSubmit = useCallback(async () => {
        const res = await axios.post("/api/user/image-upload/avatar", {
            data: imageSrc,
        });

        console.log(res);
    });

    return (
        <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
            <AnimatePresence mode="popLayout">
                {currentView === UPLOADABLE && (
                    <>
                        <ChakraBox w="100%" layout key="avatar-upload-heading">
                            <Heading color="white" fontSize={"3xl"} lineHeight="4xl" align="center">
                                Select an avatar to upload
                            </Heading>
                        </ChakraBox>
                        <ChakraBox w="100%" layout key="avatar-upload-warning">
                            <Text color="brand.neutral0" align="center" fontSize="md">
                                Size should be less than 2mb
                            </Text>
                        </ChakraBox>

                        {error && (
                            <ChakraBox
                                layout
                                color="red.300"
                                key="avatar-upload-error"
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </ChakraBox>
                        )}

                        <ChakraBox w="100%" key="avatar-submit" layout>
                            <form id="avatar-upload" method="post" onChange={handleOnChange}>
                                <Button
                                    variant="blue"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        hiddenFileInput.current.click();
                                    }}
                                    w="100%"
                                    borderRadius="24px"
                                    // isLoading={isSubmittingQuest}
                                >
                                    Select
                                </Button>
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/jpeg, image/png"
                                    style={{ display: "none" }}
                                    ref={hiddenFileInput}
                                />
                            </form>
                        </ChakraBox>
                    </>
                )}
                {currentView === SUBMITTABLE && (
                    <>
                        {/* {!error && (
                            <span className={s.board_imageUpload_imageName}>{imageFile.name}</span>
                        )}
                        {error && <span className={s.board_imageUpload_imageName}>{error}</span>} */}
                        <Image src={imageSrc} ref={imageEl} w="70%" />

                        <ButtonGroup
                            display={"flex"}
                            flexDirection={{ base: "column", md: "row" }}
                            gap="24px"
                            w="100%"
                        >
                            <Button
                                onClick={() => {
                                    setView(UPLOADABLE);
                                    setImageFile(null);
                                    setImageSrc(null);
                                    errorSet(null);
                                }}
                                variant="signIn"
                                w="100%"
                            >
                                Back
                            </Button>
                            <Button variant="blue" onClick={handleOnSubmit} w="100%">
                                Upload
                            </Button>
                        </ButtonGroup>
                    </>
                )}
                {currentView === SUBMITTED && (
                    <AnimatePresence mode="popLayout">
                        <Image
                            src="/img/user/riftly-success.gif"
                            boxSize={{ sm: "50px", md: "70px", lg: "90px" }}
                        />

                        <ChakraBox w="100%" layout key="code-quest-heading">
                            <Heading color="white" fontSize={"xl"} align="center">
                                Congrats!
                            </Heading>
                        </ChakraBox>
                        <ChakraBox w="100%" layout key="code-quest-text">
                            <Text color="brand.neutral0" align="center" fontSize="md">
                                Avatar upload successfully.
                            </Text>
                        </ChakraBox>

                        <ChakraBox w="100%" key="code-quest-submit" layout>
                            <Button
                                variant="blue"
                                onClick={handleOnClose}
                                w="100%"
                                borderRadius="24px"
                            >
                                Back to Challenges
                            </Button>
                        </ChakraBox>
                    </AnimatePresence>
                )}
                {currentView === ERROR && (
                    <>
                        <ChakraBox
                            layout
                            color="red.300"
                            key="code-quest-error"
                            exit={{ opacity: 0 }}
                        >
                            {error}
                        </ChakraBox>
                        <Button variant="blue" onClick={handleOnClose} w="100%" borderRadius="24px">
                            Back
                        </Button>
                    </>
                )}
            </AnimatePresence>
        </ModalWrapper>
    );
};

export default UploadAvatarModal;
