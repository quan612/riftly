import React from "react";
import { AdminLayout } from "/components/admin";
import dynamic from "next/dynamic";
const EnvironmentConfigComponent = dynamic(() => import("@components/admin/settings/EnvironmentConfig"));

const AdminConfigVariable = ({ session }) => {
    return <EnvironmentConfigComponent />;
};

AdminConfigVariable.Layout = AdminLayout;
AdminConfigVariable.requireAdmin = true;
export default AdminConfigVariable;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
