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
        <>
            <div className="col-xxl-12">
                <h4 className="card-title mb-3">Lookup NFT owners</h4>
                <div className="card">
                    <div className="card-body">
                        <UserStatsSearchForm onFormSubmit={onFormSubmit} />
                    </div>
                </div>
                {isFetch && <UserStatsSearchResult formData={formData} />}
            </div>
        </>
    );
};

UserStats.Layout = AdminLayout;
UserStats.requireAdmin = true;
export default UserStats;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
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

