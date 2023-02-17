import React from "react";
import s from "/sass/claim/claim.module.css";


function ImageQuestPage({ session }) {

    return (
        <>
            <div className={s.app}>


                {/* {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <ImageUpload />} */}
            </div>
        </>
    );
}

export default ImageQuestPage;

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

