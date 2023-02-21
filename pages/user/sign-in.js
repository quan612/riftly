import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";

import { Box, Flex } from "@chakra-ui/react";
import { RiftlyLogoWhiteText } from "@components/riftly/Logo";
import { SignInSignUpWrapper } from "@components/end-user/wrappers/SignInSignUpWrapper";
import { TallContainer } from "containers/user";

function SignIn() {
    return (
        <>
            <Head>
                <title>Riftly Challenger</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="DeepSea Challenger" />
                <meta
                    property="og:description"
                    content="Complete quests, earn $SHELL, unlock prizes"
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
                />
                <meta
                    property="og:site_name"
                    content="Anomura: The Cove's DeepSea Challenger"
                ></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
                />
                <link rel="icon" href="/faviconShell.png" />
            </Head>

            <Flex
                flex="1"
                position="relative"
                w="100%"
                justifyContent={"center"}
                alignItems="center"
            >
                <Box
                    className="logo-wrapper"
                    h="100%"
                    w="100%"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems="center"
                    position="relative"
                >
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems="center"
                        w="100%"
                        h="66%"
                        position="relative"
                    // maxH="100%"
                    >
                        <Box
                            display={"flex"}
                            w="100%"
                            maxH="100%"
                            height={"100%"}
                            minH="100%"
                            position="relative"
                            justifyContent={"center"}
                            alignItems="center"
                        >
                            <RiftlyLogoWhiteText />
                        </Box>
                    </Box>
                </Box>
            </Flex>


            <TallContainer>
                <SignInSignUpWrapper isSignIn={true} />
            </TallContainer>

            <Flex flex="1"></Flex>
        </>
    );
}

export default SignIn;
