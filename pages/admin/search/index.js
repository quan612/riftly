import React from "react";
import { AdminLayout } from "/components/admin";
import dynamic from "next/dynamic";
const AdminUserRewardSearchComponent = dynamic(() =>
    import("@components/admin/search/users/AdminUserRewardSearch")
);

const AdminUserRewardSearchPage = () => {
    return <AdminUserRewardSearchComponent />;
};

AdminUserRewardSearchPage.Layout = AdminLayout;
AdminUserRewardSearchPage.requireAdmin = true;
export default AdminUserRewardSearchPage;

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
