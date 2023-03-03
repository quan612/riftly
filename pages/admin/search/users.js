import React from "react";
import dynamic from "next/dynamic";
const AdminUsersComponent = dynamic(() =>
    import("@components/admin/search/users/AdminUsers")
);

const AdminSearchUsersPage = () => {
    return (
        <UsersProvider>
            <AdminUsersComponent />
        </UsersProvider>
    );
};

AdminSearchUsersPage.Layout = AdminLayout;
AdminSearchUsersPage.requireAdmin = true;
export default AdminSearchUsersPage;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { AdminLayout } from "@components/admin";
import UsersProvider from "@context/UsersContext";

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
