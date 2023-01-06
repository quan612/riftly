import React from "react";
import Head from "next/head";
import s from "/sass/claim/claim.module.css";
import { CollaborationQuestBoard, ConnectBoard } from "@components/end-user";

function AtariX({ session }) {

    return (
        <>
            <Head>
                <title>DeepSea Challenger Collaboration</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura x AtariX" />
                <meta
                    property="og:description"
                    content="We’ve partnered with AtariX! Complete quests and unlock rewards."
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/AtariXCollaboration.png"
                />
                <meta property="og:site_name" content="Anomura x AtariX"></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/AtariXCollaboration.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.app}>

                {!session && <ConnectBoard />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <CollaborationQuestBoard session={session} collaboration={"atarix"} />}

            </div>
        </>
    );
}

export default AtariX;


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