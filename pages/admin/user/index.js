import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";
import dynamic from "next/dynamic";
const AddNewUserComponent = dynamic(() => import("@components/admin/user/AddNewUser"));

const modsAddress = [];

const AdminUsers = ({ session }) => {
    return <AddNewUserComponent />;
};

AdminUsers.Layout = AdminLayout;
AdminUsers.requireAdmin = true;
export default AdminUsers;

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
