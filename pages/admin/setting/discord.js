import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";

import dynamic from "next/dynamic";
const AdminDiscordChannelsComponent = dynamic(() =>
    import("@components/admin/settings/discord/AdminDiscordChannels")
);

const modsAddress = [];

const AdminDiscordChannelPage = ({ session }) => {
    return <AdminDiscordChannelsComponent />;
};

AdminDiscordChannelPage.Layout = AdminLayout;
AdminDiscordChannelPage.requireAdmin = true;
export default AdminDiscordChannelPage;

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session || session?.user?.isAdmin === false) {
        return {
            redirect: {
                destination: '/admin/sign-in',
                permanent: false,
            },
        }
    }
    return {
        props: {
            session,
        },
    };
}
