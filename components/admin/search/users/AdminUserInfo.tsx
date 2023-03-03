import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
    Heading,
    Box,
    Flex,
    Text,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Icon,
    useToast,
    ButtonGroup,
    useDisclosure,
    Avatar,
} from "@chakra-ui/react";

import { BiRefresh } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { FaCopy, FaDownload, FaFileCsv } from "react-icons/fa";
import { useAdminRefreshUserStats } from "@shared/HOC/user";
import { shortenAddress } from "util/shortenAddress";
import { useCopyToClipboard } from "usehooks-ts";
import moment from "moment";
import { WhiteListAggregate } from "types/common";




interface UsersBannerProps {
    userDetails?: WhiteListAggregate;
};

const AdminUserInfo = ({ userDetails }: UsersBannerProps) => {
    const [userStats, isQuerying, refreshUserStatsAsync] = useAdminRefreshUserStats();
    const {
        userId,
        avatar,
        discordUserDiscriminator,
        email,
        twitterUserName,
        wallet,
        // google,
        userQuest,
        createdAt,
    } = userDetails;
    const [value, copy] = useCopyToClipboard();
    const toast = useToast();

    const questCompleted = userQuest?.filter((q) => q?.hasClaimed);
    return (
        <Flex direction={"column"} gap="1rem">
            <Avatar size="lg" src={avatar}></Avatar>
            <FormControl gap="8px">
                <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                    Member since
                </FormLabel>
                <Text fontWeight="400">{moment(createdAt).format("MM-DD-YYYY")}</Text>
            </FormControl>
            {wallet.length > 0 && (
                <FormControl gap="8px">
                    <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                        Wallet
                    </FormLabel>
                    <Flex gap="1rem">
                        <Text isTruncated maxW="80%">
                            {shortenAddress(wallet)}
                        </Text>
                        <Icon
                            transition="0.8s"
                            color="blue.300"
                            boxSize={6}
                            as={FaCopy}
                            _hover={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (wallet?.length > 16) {
                                    copy(wallet);
                                    toast({
                                        description: `Copied wallet ${wallet}`,
                                        position: "bottom-right",

                                        duration: 2000,
                                    });
                                }
                            }}
                        />
                    </Flex>
                </FormControl>
            )}

            {discordUserDiscriminator && discordUserDiscriminator.length > 0 && (
                <FormControl gap="8px">
                    <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                        Discord
                    </FormLabel>
                    <Flex>
                        <Text isTruncated maxW="80%">
                            {discordUserDiscriminator}
                        </Text>
                    </Flex>
                </FormControl>
            )}

            {twitterUserName && twitterUserName.length > 0 && (
                <FormControl gap="8px">
                    <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                        Twitter
                    </FormLabel>
                    <Flex>
                        <Text isTruncated maxW="80%">
                            {twitterUserName}
                        </Text>
                    </Flex>
                </FormControl>
            )}

            {email && email.length > 0 && (
                <FormControl gap="8px">
                    <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                        Email
                    </FormLabel>
                    <Flex>
                        <Text isTruncated maxW="80%">
                            {email}
                        </Text>
                    </Flex>
                </FormControl>
            )}

            {/* {google && google?.length > 0 && (
                <FormControl gap="8px">
                    <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                        Google
                    </FormLabel>
                    <Flex>
                        <Text isTruncated maxW="80%">
                            {google}
                        </Text>
                    </Flex>
                </FormControl>
            )} */}

            <FormControl gap="8px">
                <FormLabel fontSize="sm" fontWeight="200" mb="2px">
                    Challenges Completed
                </FormLabel>
                <Text fontWeight="400">{questCompleted.length}</Text>
            </FormControl>

            <Icon
                transition="0.8s"
                color="green.300"
                boxSize={7}
                as={BiRefresh}
                _hover={{
                    cursor: "pointer",
                }}
                onClick={async () => {
                    let payload = {
                        userId,
                    };

                    await refreshUserStatsAsync(payload);
                }}
            />
        </Flex>
    );
};

export default AdminUserInfo;
