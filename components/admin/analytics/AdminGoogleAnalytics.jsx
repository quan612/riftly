import React from "react";

import PageViewsChart from "./google/PageViewsChart";
import UsersByChart from "./google/UsersByChart";
const AdminGoogleAnalytics = () => {
    return (
        <div className="row">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">
                <div id="user-activity" className="card">
                    <div className="card-body">
                        <PageViewsChart />
                    </div>
                </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-8 col-md-8">
                <div id="user-activity" className="card">
                    <div className="card-body">
                        <UsersByChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGoogleAnalytics;
