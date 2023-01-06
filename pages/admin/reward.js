import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";
import AddNewReward from "@components/admin/reward/AddNewReward";
import Enums from "enums";
import { utils } from "ethers";

const modsAddress = [
    // "0x2fe1d1B26401a922D19E1E74bed2bA799c64E040",
    // "0xc08f1F50B7d926d0c60888220176c27CE55dA926",
    // "0xC055fe5B545F4FDCF55C4d010aB4eE4972319b92",
    // "0xcA70D03e8eFFb0C55542a9AEA892dD74Fe208335",
    // 0x2fe1d1B26401a922D19E1E74bed2bA799c64E040 
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
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                        <h4 className="card-title mb-3">Reward</h4>
                        <div className="card">
                            <div className="card-body">
                                <AddNewReward />
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-6">
                        <h4 className="card-title mb-3">Preview</h4>
                        <div className="card items">
                            <div className="card-body">
                                <img
                                    className=""
                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/preview.png`}
                                    alt="reward-preview"
                                />
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
