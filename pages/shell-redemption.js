import Head from "next/head";
import React from "react";
import s from "/sass/redemption/index.module.css";
import { ShellRedeem } from "@components/end-user";
import ShellRedeemConnectBoard from "@components/end-user/shell-redeem/ShellRedeemConnectBoard";

function ShellRedemtionPage({ session }) {

    return (
        <>
            <Head>
                <title>Anomura | $SHELL Redemption Event</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Anomura | $SHELL Redemption Event" />
                <meta
                    property="og:description"
                    content="Spend your $SHELL on a chance to win shiny treasures like a mintlist spot, crab swag and NFTs!"
                />
                <meta
                    property="og:image"
                    content="https://anomuragame.com/challenger/Shell_Redemption_Preview.png"
                />
                <meta
                    property="og:site_name"
                    content="Anomura | $SHELL Redemption Event"
                ></meta>
                <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:image"
                    content="https://anomuragame.com/challenger/Shell_Redemption_Preview.png"
                />
                <link rel="icon" href="/challenger/faviconShell.png" />
            </Head>
            <div className={s.redemption}>
                {!session && <ShellRedeemConnectBoard />}
                {session && <ShellRedeem session={session} />}
                {/* <ShellRedeem session={session} /> */}
            </div>
        </>
    );
}

export default ShellRedemtionPage

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