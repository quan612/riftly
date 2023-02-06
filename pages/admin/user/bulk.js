import React from "react";
import { AdminLayout } from "/components/admin";
import dynamic from "next/dynamic";
const AdminBulkUsersAddComponent = dynamic(() => import("@components/admin/user/AdminBulkUsersAdd"))

const AdminBulkAddUsersPage = ({ session }) => {
    return <AdminBulkUsersAddComponent />;
};

AdminBulkAddUsersPage.Layout = AdminLayout;
AdminBulkAddUsersPage.requireAdmin = true;
export default AdminBulkAddUsersPage;

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
