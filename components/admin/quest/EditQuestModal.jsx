import React from "react";
import Enums from "enums";
import { withRewardTypeQuery } from "shared/HOC/reward";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    TwitterRetweetQuest,
    InstagramFollowQuest,
    FreeLimitedShell,
    DailyShellQuestForm,
    ImageUploadQuest,
    CodeQuestForm,
    WalletAuthQuestForm,
    UnstoppableAuthQuestForm,
} from "./index";
import JoinDiscordQuest from "./Forms/JoinDiscordQuest";
import ClaimRewardForOwningNFTForm from "./Forms/ClaimRewardForOwningNFTForm";

import {
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
} from "@chakra-ui/react";
import { RiftlyModalCloseButton } from "@components/shared/Buttons";
import SmsVerificationQuestForm from "./Forms/SmsVerificationQuestForm";

const EditQuestModal = ({ quest, isOpen, onClose, rewardTypes }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                borderRadius="16px"
                bg="brand.neutral4"
                minH="55%"
                w="80%"
                maxW="container.lg"
                mt="7%"
                transition={"1.25s"}
            >
                <RiftlyModalCloseButton onClose={onClose} />
                <ModalBody
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                    maxH={"100%"}
                >
                    {quest.type.name === Enums.OWNING_NFT_CLAIM && rewardTypes && (
                        <ClaimRewardForOwningNFTForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}
                    {quest.type.name === Enums.WALLET_AUTH && rewardTypes && (
                        <WalletAuthQuestForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}
                    {quest.type.name === Enums.DISCORD_AUTH && rewardTypes && (
                        <DiscordAuthQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.TWITTER_AUTH && rewardTypes && (
                        <TwitterAuthQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.TWITTER_RETWEET && rewardTypes && (
                        <TwitterRetweetQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.FOLLOW_TWITTER && rewardTypes && (
                        <TwitterFollowQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.FOLLOW_INSTAGRAM && rewardTypes && (
                        <InstagramFollowQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.IMAGE_UPLOAD_QUEST && (
                        <ImageUploadQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.LIMITED_FREE_SHELL && (
                        <FreeLimitedShell
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.JOIN_DISCORD && (
                        <JoinDiscordQuest
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.DAILY_SHELL && (
                        <DailyShellQuestForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}
                    {quest.type.name === Enums.CODE_QUEST && (
                        <CodeQuestForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.UNSTOPPABLE_AUTH && (
                        <UnstoppableAuthQuestForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}

                    {quest.type.name === Enums.SMS_VERIFICATION && (
                        <SmsVerificationQuestForm
                            quest={quest}
                            rewardTypes={rewardTypes}
                            closeModal={onClose}
                        />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default withRewardTypeQuery(EditQuestModal);
