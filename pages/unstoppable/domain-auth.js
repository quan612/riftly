import React from "react";
import s from "/sass/claim/claim.module.css";
import { ConnectBoard, UnstoppableAuth } from "@components/end-user";

function UnstoppableAuthPage({ session }) {

  return (
    <>
      <div className={s.app}>
        {!session && <ConnectBoard />}
        {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false" && <NotEnabledChallenger />}
        {session && process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && <UnstoppableAuth session={session} />}

      </div>
    </>
  );
}

export default UnstoppableAuthPage;


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
