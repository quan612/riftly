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
