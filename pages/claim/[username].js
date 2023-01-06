import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { ConnectBoard, UserClaimReward } from "@components/end-user";

const util = require("util");

function ClaimReward({ session }) {
    const [error, setError] = useState(null);
    const { web3Error } = useContext(Web3Context);

    useEffect(() => {
        if (web3Error) {
            setError(web3Error);
        }
    }, [web3Error]);

    return (
        <>
            <div className={s.app}>
                {!session && <ConnectBoard />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger />}
                {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <UserClaimReward session={session} />}

            </div>
        </>
    );
}

export default ClaimReward;


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

