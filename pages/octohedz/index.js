import React from "react";
import Head from "next/head";
import s from "/sass/claim/claim.module.css";
import { CollaborationQuestBoard, ConnectBoard } from "@components/end-user";

function OctoHedz({ session }) {

    return (
        <>
            <Head>
                <title>DeepSea Challenger Collaboration</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura x OctoHedz" />
                <meta
                    property="og:description"
                    content="We’ve partnered with OctoHedz! Complete quests, earn $SHELL, unlock prizes."
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/Anomura_x_OctoHedz_preview.png"
                />
                <meta property="og:site_name" content="Anomura x OctoHedz"></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/Anomura_x_OctoHedz_preview.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>
                {!session && <ConnectBoard />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <CollaborationQuestBoard session={session} collaboration={"octohedz"} />}
            </div>
        </>
    );
}

export default OctoHedz;

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
