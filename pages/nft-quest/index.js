import React from "react";
import s from "/sass/claim/claim.module.css";
import { ConnectBoard } from "@components/end-user";
import Enums from "enums";
import ClaimRewardForOwningNFT from "@components/end-user/single-board-quest/ClaimRewardForOwningNFT";

function OwningNftReward({ session }) {

    return (
        <>
            <div className={s.app}>
                {!session && <ConnectBoard />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger session={session} />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <ClaimRewardForOwningNFT session={session} />}
            </div>
        </>
    );
}

export default OwningNftReward;

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
