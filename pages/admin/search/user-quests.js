import React, { useEffect, useState } from "react";

import AdminUserQuestsSearch from "@components/admin/search/user-quests/AdminUserQuestsSearch";
import AdminSearchLayout from "@components/layout/AdminSearchLayout";

const AdminSearchUserQuestPage = () => {
    return (
        <AdminUserQuestsSearch />
    );
};

AdminSearchUserQuestPage.Layout = AdminSearchLayout;
AdminSearchUserQuestPage.requireAdmin = true;
export default AdminSearchUserQuestPage;

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
