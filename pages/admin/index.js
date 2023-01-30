import { AdminLayout } from "/components/admin";
import React, { useEffect } from "react";
function Admin() {


  return (
    // <div className="profile-page">
    //   <div className="container">
    //     <div className="col-xxl-12">
    //       <div className="row">
    //         <div className="col-12">
    //           <AdminAnalyticsMenu />
    //         </div>
    //       </div>
    //       <div className="col-xxl-12">
    //         <AdminGoogleAnalytics />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <AdminGoogleAnalytics />
  );
}

Admin.requireAdmin = true;
Admin.Layout = AdminLayout;
export default Admin;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import AdminAnalyticsMenu from "../../components/layout/AdminAnalyticsMenu";

import AdminGoogleAnalytics from "../../components/admin/analytics/AdminGoogleAnalytics";
import AdminNavigation from "@components/admin/nav";
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
