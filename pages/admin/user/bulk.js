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
