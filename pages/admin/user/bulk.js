import React, { useEffect, useState } from "react";
import { AdminLayout, AddNewUser } from "/components/admin";

const AdminBulkAddUsersPage = ({ session }) => {
    return <AdminBulkUsersAdd />;
};

AdminBulkAddUsersPage.Layout = AdminLayout;
AdminBulkAddUsersPage.requireAdmin = true;
export default AdminBulkAddUsersPage;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

import AdminBulkUsersAdd from "@components/admin/user/AdminBulkUsersAdd";
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
