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
