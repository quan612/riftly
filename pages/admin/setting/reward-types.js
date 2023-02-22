import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";

const modsAddress = [];
import dynamic from "next/dynamic";
const AdminRewardTypesComponent = dynamic(() =>
    import("@components/admin/settings/reward-types/AdminRewardTypes")
);

const AdminRewardTypePage = ({ session }) => {
    return <AdminRewardTypesComponent />;
};

AdminRewardTypePage.Layout = AdminLayout;
AdminRewardTypePage.requireAdmin = true;
export default AdminRewardTypePage;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
