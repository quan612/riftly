import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";
import { CurrentQuests } from "@components/admin";
import Enums from "enums";
import { utils } from "ethers";

const modsAddress = [
    "0x2fe1d1B26401a922D19E1E74bed2bA799c64E040",
    "0xc08f1F50B7d926d0c60888220176c27CE55dA926",
    "0xC055fe5B545F4FDCF55C4d010aB4eE4972319b92",
    "0xcA70D03e8eFFb0C55542a9AEA892dD74Fe208335",
];

const AdminQuest = ({ session }) => {
    const [viewable, setViewable] = useState(false);

    useEffect(async () => {
        if (modsAddress.includes(utils.getAddress(session?.user?.address))) {
            setViewable(false);
        } else {
            setViewable(true);
        }
    }, [session]);

    if (viewable) {
        return <CurrentQuests />;
    } else {
        return <label>Sorry we can't see this page</label>;
    }
};

AdminQuest.Layout = AdminLayout;
AdminQuest.requireAdmin = true;
export default AdminQuest;

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
