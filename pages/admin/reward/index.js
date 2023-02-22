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
