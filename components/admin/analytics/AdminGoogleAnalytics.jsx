import React, { useEffect, useState, useCallback } from "react";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { debounce } from "utils/";
import {} from "@shared/HOC/settings";
import LineChart from "./shared/LineChart";

const AdminGoogleAnalytics = () => {
    return (
        <div className="row">
            <div className="col-xxl-12">
                <h4 className="card-title mb-3">Create Channel</h4>
                <div className="col-xxl-6 col-xl-8 col-lg-6">
                    <h4 className="card-title mb-3">ETH Price</h4>

                    <div id="user-activity" className="card">
                        <div className="card-body">
                            <LineChart
                                lineData={[0, 105, 92, 155, 138, 205, 120, 92, 155, 138, 205, 320]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGoogleAnalytics;
