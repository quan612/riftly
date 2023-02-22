import React, { useEffect, useState, useContext } from "react";

import { Web3Context } from "@context/Web3Context";

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



            {/* {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <UserClaimReward session={session} />} */}


        </>
    );
}

export default ClaimReward;


import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
export async function getServerSideProps(context) {
    const session = await getServerSession(
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

