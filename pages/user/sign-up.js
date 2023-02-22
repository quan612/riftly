import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";

import { Box } from "@chakra-ui/react";
import { RiftlyLogoWhiteText } from "@components/riftly/Logo";
import { SignInSignUpWrapper } from "@components/end-user/wrappers/SignInSignUpWrapper";
import { TallContainer } from "containers/user";

import * as gtag from '@lib/ga/gtag'

function SignUp() {
    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            console.log("gtag event tracked")
            gtag.event({
                action: 'sign_up',
                category: 'User',
                label: "User signs up successfully",
            })
        }

    }, [])
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

            <Box
                position="absolute"
                top="0"
                w={{ base: "28%", md: "179px" }}
                h={{ base: "15%", md: "198px" }}
                display={"flex"}
                justifyContent={"center"}
            >
                <Box display={"flex"} alignItems="center" w="58%">
                    <RiftlyLogoWhiteText />
                </Box>
            </Box>

            <TallContainer>
                <SignInSignUpWrapper isSignIn={false} />
            </TallContainer>
        </>
    );
}

export default SignUp;