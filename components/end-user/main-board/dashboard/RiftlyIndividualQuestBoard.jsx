import React, { useEffect, useState, useCallback, useRef } from "react";
import { useToast, Heading, Box, Container, Flex } from "@chakra-ui/react";

import { AnimatePresence } from "framer-motion";

import UserTierLevel from "./UserTierLevel";
import FeatureQuests from "./FeaturedQuests";
import ChallengeQuests from "./ChallengeQuests";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

const RiftlyIndividualQuestBoard = ({ session }) => {
    let levelProgress = useRef(0);

    return (
        <>
            {/* To avoid challenges header to jump around */}
            <AnimatePresence initial={false}>
                <UserTierLevel ref={levelProgress} session={session} key="user-tier" />
                <FeatureQuests key="feature" />
                <ChallengeQuests key="challenge" />
            </AnimatePresence>
        </>
    );
};

export default RiftlyIndividualQuestBoard;
