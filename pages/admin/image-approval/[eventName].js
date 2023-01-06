import React, { useEffect } from "react";
import { AdminLayout, ImageUploadApproval } from "/components/admin";

const AdminImageApproval = ({ session }) => {
    useEffect(async () => { }, []);

    return (
        <div className="row justify-content-center">
            <ImageUploadApproval />
        </div>
    );
};

AdminImageApproval.Layout = AdminLayout;
AdminImageApproval.requireAdmin = true;
export default AdminImageApproval;

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
