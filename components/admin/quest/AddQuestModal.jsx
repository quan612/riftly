import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import {
    TwitterAuthQuest,
    TwitterFollowQuest,
    InstagramFollowQuest,
    TwitterRetweetQuest,
    FreeLimitedShell,
    DailyShellQuestForm,
    ImageUploadQuest,
    CodeQuestForm,
    WalletAuthQuestForm,
    UnstoppableAuthQuestForm,
    DiscordAuthQuest,
} from "./index";

import { withRewardTypeQuery } from "shared/HOC/reward";
import { withQuestTypeQuery } from "@shared/HOC/quest";
import JoinDiscordQuest from "./Forms/JoinDiscordQuest";
import ClaimRewardForOwningNFTForm from "./Forms/ClaimRewardForOwningNFTForm";
import {
    Heading,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    Input,
    CloseButton,
    Select,
    Text,
} from "@chakra-ui/react";
import { RiftlyModalCloseButton } from "@components/shared/Buttons";
import SmsVerificationQuestForm from "./Forms/SmsVerificationQuestForm";

const AddQuestModal = ({ isOpen, onClose, rewardTypes, questTypes }) => {
    const [selectedType, setSelectedType] = useState();

    useEffect(async () => {}, []);

    const handleOnSelectChange = (e) => {
        setSelectedType(e.target.value);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                borderRadius="16px"
                bg="brand.neutral4"
                minH="auto"
                w="80%"
                maxW="container.lg"
                mt="5%"
                transition={"1.25s"}
            >
                <RiftlyModalCloseButton onClose={onClose} />

                <Select w={"320px"} onChange={handleOnSelectChange} mt="16px" ms="16px">
                    <option value="Select">Select Type Of Quest</option>
                    {questTypes &&
                        questTypes.map((item) => (
                            <option key={item.id} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                </Select>

                <ModalBody
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                    maxH={"100%"}
                >
                    {selectedType === Enums.UNSTOPPABLE_AUTH && (
                        <UnstoppableAuthQuestForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}

                    {selectedType === Enums.OWNING_NFT_CLAIM && (
                        <ClaimRewardForOwningNFTForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.WALLET_AUTH && (
                        <WalletAuthQuestForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.DISCORD_AUTH && (
                        <DiscordAuthQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}

                    {selectedType === Enums.TWITTER_AUTH && (
                        <TwitterAuthQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.TWITTER_RETWEET && (
                        <TwitterRetweetQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.FOLLOW_TWITTER && (
                        <TwitterFollowQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.FOLLOW_INSTAGRAM && (
                        <InstagramFollowQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}

                    {selectedType === Enums.IMAGE_UPLOAD_QUEST && (
                        <ImageUploadQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.LIMITED_FREE_SHELL && (
                        <FreeLimitedShell
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.JOIN_DISCORD && (
                        <JoinDiscordQuest
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.DAILY_SHELL && (
                        <DailyShellQuestForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                    {selectedType === Enums.CODE_QUEST && (
                        <CodeQuestForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}

                    {selectedType === Enums.SMS_VERIFICATION && (
                        <SmsVerificationQuestForm
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                            isCreate={true}
                        />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
const firstHOC = withQuestTypeQuery(AddQuestModal);
export default withRewardTypeQuery(firstHOC);
