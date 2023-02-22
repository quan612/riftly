import { AdminLayout } from "/components/admin";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
const AdminGoogleAnalyticsComponent = dynamic(() => import("@components/admin/analytics/AdminGoogleAnalytics"))
const AdminPage = () => {

  return (
    <AdminGoogleAnalyticsComponent />
  );
}

AdminPage.requireAdmin = true;
AdminPage.Layout = AdminLayout;
export default AdminPage;

import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  context.res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  return {
    props: {
      session,
    },
  }
}
