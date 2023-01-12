import React, { useEffect, useState } from "react";
import { AdminLayout, SearchForm, SearchResult } from "/components/admin";

const AdminSearch = () => {
    return (
        <div className="profile-page">
            <div className="container">
                <div className="col-xxl-12">
                    <div className="row">
                        <div className="col-12">
                            <SearchMenu />
                        </div>
                    </div>
                    <div className="col-xxl-12">
                        <AdminUserQuestsSearch />
                    </div>
                </div>
            </div>
        </div>
    );
};

AdminSearch.Layout = AdminLayout;
AdminSearch.requireAdmin = true;
export default AdminSearch;

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import SearchMenu from "@components/layout/SearchMenu";
import AdminUserQuestsSearch from "@components/admin/search/user-quests/AdminUserQuestsSearch";
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            session,
        },
    };
}
