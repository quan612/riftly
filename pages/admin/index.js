

import { AdminLayout } from "/components/admin";
import React, { useEffect } from "react";


function Admin() {


  return (
    <div className="profile-page">
      <div className="container">
        <div className="col-xxl-12">
          <div className="row">
            <div className="col-12">
              <AdminAnalyticsMenu />
            </div>
          </div>
          <div className="col-xxl-12">

            <EnvironmentConfig />

          </div>

        </div>
      </div>
    </div>
  );
}

Admin.requireAdmin = true;
Admin.Layout = AdminLayout;

export default Admin;


import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import AdminAnalyticsMenu from "../../components/layout/AdminAnalyticsMenu";
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

{/* <div className="col-xxl-6 col-xl-8 col-lg-6">

<h4 className="card-title mb-3">ETH Price</h4>

<div id="user-activity" className="card">


    <div className="card-body">
        <BarChart lineData={lineData} />
    </div>
</div>
</div> */}