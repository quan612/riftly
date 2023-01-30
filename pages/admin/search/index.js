import React from "react";
import AdminUserRewardSearch from "@components/admin/search/users/AdminUserRewardSearch";
import AdminSearchLayout from "@components/layout/AdminSearchLayout";

const AdminUserRewardSearchPage = () => {
    return <AdminUserRewardSearch />;
};

AdminUserRewardSearchPage.Layout = AdminSearchLayout;
AdminUserRewardSearchPage.requireAdmin = true;
export default AdminUserRewardSearchPage;

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
