import React from "react";
import { AdminLayout } from "@components/admin";

import dynamic from "next/dynamic";
const BulkRewardToUserComponent = dynamic(() => import("@components/admin/reward/BulkRewardsUsers"));

const modsAddress = [];

const AdminBulkRewards = ({ session }) => {
    return <BulkRewardToUserComponent />;
};

AdminBulkRewards.Layout = AdminLayout;
AdminBulkRewards.requireAdmin = true;
export default AdminBulkRewards;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session || session?.user?.isAdmin === false) {
        return {
            redirect: {
                destination: '/admin/sign-in',
                permanent: false,
            },
        }
    }
    return {
        props: {
            session,
        },
    };
}
