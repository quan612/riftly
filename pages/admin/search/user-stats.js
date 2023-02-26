import React from "react";
import dynamic from "next/dynamic";
const AdminUserStatsSearchComponent = dynamic(() =>
    import("@components/admin/search/user-stats/AdminUserStatsSearch")
);

const AdminSearchUserStatsPage = () => {
    return (
        <UsersProvider>
            <AdminUserStatsSearchComponent />
        </UsersProvider>
    );
};

AdminSearchUserStatsPage.Layout = AdminLayout;
AdminSearchUserStatsPage.requireAdmin = true;
export default AdminSearchUserStatsPage;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { AdminLayout } from "@components/admin";
import { UsersProvider } from "@context/UsersContext";

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
