

import { AdminLayout } from "/components/admin";
import React, { useEffect } from "react";


function Admin({ session }) {
  useEffect(() => { }, []);

  return (
    <>
      <div>this is admin home</div>
    </>
  );
}

Admin.requireAdmin = true;
Admin.Layout = AdminLayout;

export default Admin;


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