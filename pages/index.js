import Head from "next/head";
import React from "react";
import s from "/sass/claim/claim.module.css";
import { ConnectBoard, IndividualQuestBoard } from "@components/end-user";
import NotEnabledChallenger from "@components/end-user/NotEnabledChallenger";
const util = require("util");

// Home page for user
function Home({ session }) {

    return (
        <>
            <Head>
                <title>DeepSea Challenger</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="DeepSea Challenger" />
                <meta
                    property="og:description"
                    content="Complete quests, earn $SHELL, unlock prizes"
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <meta
                    property="og:site_name"
                    content="Anomura: The Cove's DeepSea Challenger"
                ></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/DeepSeaChallengerThumbnail_2.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>
                {!session && <ConnectBoard />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger session={session} />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <IndividualQuestBoard session={session} />}
            </div>
        </>
    );
}

export default Home;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    }
}
