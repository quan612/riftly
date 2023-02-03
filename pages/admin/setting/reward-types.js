import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";

const modsAddress = [];

const AdminRewardTypePage = ({ session }) => {
    return <AdminRewardTypes />;
};

AdminRewardTypePage.Layout = AdminLayout;
AdminRewardTypePage.requireAdmin = true;
export default AdminRewardTypePage;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

import AdminRewardTypes from "@components/admin/settings/reward-types/AdminRewardTypes";
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
