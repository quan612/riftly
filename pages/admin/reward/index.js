import React from "react";
import { AdminLayout } from "/components/admin";

import dynamic from "next/dynamic";
const AddRewardToUserComponent = dynamic(() => import("@components/admin/reward/AddRewardToUser"));

const modsAddress = [];

const AdminRewards = ({ session }) => {
    return <AddRewardToUserComponent />;
};

AdminRewards.Layout = AdminLayout;
AdminRewards.requireAdmin = true;
export default AdminRewards;

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
