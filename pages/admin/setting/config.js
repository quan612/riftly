import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";

const AdminConfigVariable = ({ session }) => {
    return <EnvironmentConfig />;
};

AdminConfigVariable.Layout = AdminLayout;
AdminConfigVariable.requireAdmin = true;
export default AdminConfigVariable;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import EnvironmentConfig from "@components/admin/settings/EnvironmentConfig";

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
