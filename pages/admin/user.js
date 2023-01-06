import React, { useEffect, useState } from "react";
import { AdminLayout, AddNewUser } from "/components/admin";
import { utils } from "ethers";

const modsAddress = [
    // "0x2fe1d1B26401a922D19E1E74bed2bA799c64E040",
    // "0xc08f1F50B7d926d0c60888220176c27CE55dA926",
    // "0xC055fe5B545F4FDCF55C4d010aB4eE4972319b92",
    // "0xcA70D03e8eFFb0C55542a9AEA892dD74Fe208335",
];

const AdminUsers = ({ session }) => {
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
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-8 col-xl-8 col-lg-12">
                        <h4 className="card-title mb-3">Manual User</h4>
                        <div className="card">
                            <div className="card-body">
                                <AddNewUser />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <label>Sorry we can't see this page</label>;
    }
};

AdminUsers.Layout = AdminLayout;
AdminUsers.requireAdmin = true;
export default AdminUsers;


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
