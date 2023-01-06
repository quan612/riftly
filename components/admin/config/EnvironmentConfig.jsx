import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import Enums from "enums";
import axios from "axios";

const EnvironmentConfig = () => {
    const [configs, setConfigs] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        let queryConfig = await axios
            .get(`${Enums.BASEPATH}/api/admin/configs/`)
            .then((r) => r.data);

        setLoading(false);
        setConfigs(queryConfig);
    }, []);

    const initialValues = {
        id: configs?.id || null,
        discordId: configs?.discordId || "",
        discordSecret: configs?.discordSecret || "",
        discordBackend: configs?.discordBackend || "",
        discordBackendSecret: configs?.discordBackendSecret || "",
        twitterId: configs?.twitterId || "",
        twitterSecret: configs?.twitterSecret || "",
    };

    return (
        <>
            <div className="col-6 mb-3">
                <label className="form-label">
                    Environment Type: {configs?.env || "Development"}
                </label>
            </div>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validateOnBlur={true}
                validateOnChange={false}
                onSubmit={async (fields, { setErrors, resetForm }) => {
                    //alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
                    const payload = { ...fields };
                    setLoading(true);
                    const res = await axios.post(
                        `${Enums.BASEPATH}/api/admin/configs/upsert`,
                        payload
                    );
                    if (res.isError) {
                        setErrors(res.message);
                    }
                    setLoading(false);
                }}
            >
                {({ errors, status, touched }) => (
                    <Form>
                        <div className="row">
                            <div className="col-xxl-12">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="media-body">
                                        <h5 className="mb-0">Environment Config</h5>
                                    </div>
                                </div>
                            </div>
                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Discord</label>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        DISCORD CLIENT ID
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordId"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.discordId && touched?.discordId
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        DISCORD CLIENT SECRET
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordSecret"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.discordSecret && touched?.discordSecret
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        DISCORD NODEJS
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordBackend"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.discordBackend && touched?.discordBackend
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        NODEJS SECRET
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordBackendSecret"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.discordBackendSecret &&
                                                touched?.discordBackendSecret
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Twitter</label>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        TWITTER CLIENT ID
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="twitterId"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.twitterId && touched?.twitterId
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        TWITTER CLIENT SECRET
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="twitterSecret"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.twitterSecret && touched?.twitterSecret
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 col-3">
                            <button
                                type="submit"
                                className="btn btn-primary mr-2 w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Submit"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default EnvironmentConfig;
