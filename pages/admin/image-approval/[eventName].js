import React, { useEffect } from "react";
import { AdminLayout } from "/components/admin";
import dynamic from "next/dynamic";
const ImageUploadApprovalComponent = dynamic(() => import("@components/admin/image-approval/ImageUploadApproval"));

const AdminImageApproval = ({ session }) => {
    useEffect(async () => { }, []);

    return (
        <div className="row justify-content-center">
            <ImageUploadApprovalComponent />
        </div>
    );
};

AdminImageApproval.Layout = AdminLayout;
AdminImageApproval.requireAdmin = true;
export default AdminImageApproval;

import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'

export async function getServerSideProps(context) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );
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
    }
}
