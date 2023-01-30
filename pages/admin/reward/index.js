import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";
import AddRewardToUser from "@components/admin/reward/AddRewardToUser";
import { utils } from "ethers";

const modsAddress = [
    // "0x2fe1d1B26401a922D19E1E74bed2bA799c64E040",
];

const AdminRewards = ({ session }) => {
    const [viewable, setViewable] = useState(false);

    useEffect(async () => {
        if (modsAddress.includes(utils.getAddress(session?.user?.address))) {
            setViewable(false);
        } else {
            setViewable(true);
        }
    }, [session]);

    if (viewable) {
        return (
            <AddRewardToUser />
        );
    } else {
        return <label>Sorry we can't see this page</label>;
    }
};

AdminRewards.Layout = AdminLayout;
AdminRewards.requireAdmin = true;
export default AdminRewards;

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
