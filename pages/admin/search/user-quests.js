import React from "react";
import { AdminLayout } from "/components/admin";

import dynamic from "next/dynamic";
const AdminUserQuestsSearchComponent = dynamic(() =>
    import("@components/admin/search/user-quests/AdminUserQuestsSearch")
);

const AdminSearchUserQuestPage = () => {
    return (
        <AdminUserQuestsSearchComponent />
    );
};

AdminSearchUserQuestPage.Layout = AdminLayout;
AdminSearchUserQuestPage.requireAdmin = true;
export default AdminSearchUserQuestPage;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
