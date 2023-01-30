import React from "react";
import AdminSearchLayout from "@components/layout/AdminSearchLayout";

const AdminSearchUserStatsPage = () => {
    return (
        <AdminUserStatsSearch />
    );
};

AdminSearchUserStatsPage.Layout = AdminSearchLayout;
AdminSearchUserStatsPage.requireAdmin = true;
export default AdminSearchUserStatsPage;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import AdminUserStatsSearch from "../../../components/admin/search/user-stats/AdminUserStatsSearch";

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    return {
        props: {
            session,
        },
    };
}
