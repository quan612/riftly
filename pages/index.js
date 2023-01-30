import Head from "next/head";
import React from "react";
import s from "/sass/claim/claim.module.css";

import NotEnabledChallenger from "@components/end-user/NotEnabledChallenger";

import RiftlyConnectBoard from "@components/end-user/RiftlyConnectBoard";
import RiftlyIndividualQuestBoard from "@components/end-user/main-board/RiftlyIndividualQuestBoard";

// Home page for user
function Home({ session }) {
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
            <Box w="100%" minH="100vh" h="auto" display={"flex"} position={"relative"}>
                {!session && <RiftlyConnectBoard />}
                {/* {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger session={session} />} */}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && (
                    <>
                        <Banner />
                        <RiftlyIndividualQuestBoard session={session} />
                    </>
                )}
            </Box>
        </>
    );
}

import { Box, Container, Image } from "@chakra-ui/react";

const Banner = () => {
    return (
        <Box
            minW={"100%"}
            w="100%"

            h="176px"

            display={"flex"}
            position={"relative"}
            justifyContent={"center"}
        >
            <Box
                position={"absolute"}
                h="100vh"
                w="100%"
                backgroundImage="/img/user/banner.png"
                backgroundPosition="center"
                backgroundSize={"cover"}
                backgroundRepeat="no-repeat"
            >

            </Box>

            <Box position="absolute" top="0" h="calc(100% - 32px)" display={"flex"}>
                <Box display={"flex"} alignItems="center">
                    <Image src={"/img/user/Logo_white.svg"} w={"105.9px"} h="64px" fit={"fill"} />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
