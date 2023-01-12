import { UserStatsSearchForm, UserStatsSearchResult } from "@components/admin";
import React, { useEffect, useState } from "react";
import { AdminLayout, SearchForm, SearchResult } from "/components/admin";

const UserStats = () => {
    const [formData, setFormData] = useState({});

    const [isFetch, setIsFetch] = useState(false);
    useEffect(() => { }, []);

    const onFormSubmit = (data) => {
        setFormData(data);
        setIsFetch(true);
    };

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
                        <p className="mb-2">Lookup NFT owners</p>
                        <div className="card">
                            <div className="card-body">
                                <UserStatsSearchForm onFormSubmit={onFormSubmit} />
                            </div>
                        </div>
                        {isFetch && <UserStatsSearchResult formData={formData} />}
                    </div>
                </div></div></div>
    );
};

UserStats.Layout = AdminLayout;
UserStats.requireAdmin = true;
export default UserStats;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import SearchMenu from "@components/layout/SearchMenu";
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    }
}

