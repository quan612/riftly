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
            .get(`${Enums.BASEPATH}/api/admin/settings/variables/`)
            .then((r) => r.data);

        setLoading(false);
        setConfigs(queryConfig);
    }, []);

    const initialValues = {
        id: configs?.id || null,
        discordId: configs?.discordId || "",
        discordBotToken: configs?.discordBotToken || "",
        discordSecret: configs?.discordSecret || "",
        discordBackend: configs?.discordBackend || "",
        discordBackendSecret: configs?.discordBackendSecret || "",
        twitterId: configs?.twitterId || "",
        twitterSecret: configs?.twitterSecret || "",
        pendingRewardImageUrl: configs?.pendingRewardImageUrl || "",
        cloudinaryName: configs?.cloudinaryName || "",
        cloudinaryKey: configs?.cloudinaryKey || "",
        cloudinarySecret: configs?.cloudinarySecret || "",
        hostUrl: configs?.hostUrl || "",
        twitterBearerToken: configs?.twitterBearerToken || "",
        googleClientEmail: configs?.googleClientEmail || "",
        googleClientId: configs?.googleClientId || "",
        googleProjectId: configs?.googleProjectId || "",
        googlePropertyId: configs?.googlePropertyId || "",
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
                    const payload = { ...fields };
                    setLoading(true);

                    try {
                        const res = await axios
                            .post(`${Enums.BASEPATH}/api/admin/settings/variables/upsert`, payload)
                            .then((r) => r.data);

                        if (res.isError) {
                            setErrors(res.message);
                        }
                    } catch (error) {
                        console.log(error.message);
                        setErrors(error.message);
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
                                        DISCORD BOT TOKEN
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordBotToken"
                                            type="password"
                                            className={
                                                "form-control" +
                                                (errors?.discordBotToken && touched?.discordBotToken
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                                <label className=" col-sm-12 col-form-label">
                                    (Bot needs at least SEND_MESSAGE permission on the server)
                                </label>
                            </div>
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
                                            type="password"
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
                            {/* <div className="col-12 mb-3">
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
                            </div> */}

                            {/* Its children  */}
                            {/* <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        DISCORD NODEJS SECRET
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="discordBackendSecret"
                                            type="password"
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
                            </div> */}
                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Twitter</label>
                            </div>
                            {/* Its children  */}

                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        TWITTER BEARER TOKEN
                                    </label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="twitterBearerToken"
                                            type="password"
                                            className={
                                                "form-control" +
                                                (errors?.twitterBearerToken &&
                                                touched?.twitterBearerToken
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
                                            type="password"
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
                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Misc</label>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">
                                        PENDING REWARD IMAGE URL
                                    </label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="pendingRewardImageUrl"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.pendingRewardImageUrl &&
                                                touched?.pendingRewardImageUrl
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                    <label className=" col-sm-4 col-form-label">
                                        (A Http Link to the image)
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">HOST URL</label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="hostUrl"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.hostUrl && touched?.hostUrl
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                    <label className=" col-sm-4 col-form-label">
                                        (Vercel host that referred on multiple places)
                                    </label>
                                </div>
                            </div>

                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Cloudinary</label>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">CLOUD NAME</label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="cloudinaryName"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.cloudinaryName && touched?.cloudinaryName
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">CLOUD KEY</label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="cloudinaryKey"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.cloudinaryKey && touched?.cloudinaryKey
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">CLOUD SECRET</label>
                                    <div className="col-sm-8">
                                        <Field
                                            name="cloudinarySecret"
                                            type="password"
                                            className={
                                                "form-control" +
                                                (errors?.cloudinarySecret &&
                                                touched?.cloudinarySecret
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Type   */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Analytics</label>
                            </div>
                            {/* Its children  */}
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">Client Email</label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="googleClientEmail"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.googleClientEmail &&
                                                touched?.googleClientEmail
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">Client Id</label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="googleClientId"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.googleClientId && touched?.googleClientId
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">Project Id</label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="googleProjectId"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.googleProjectId && touched?.googleProjectId
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="form-group row">
                                    <label className=" col-sm-4 col-form-label">Property Id</label>

                                    <div className="col-sm-8">
                                        <Field
                                            name="googlePropertyId"
                                            type="text"
                                            className={
                                                "form-control" +
                                                (errors?.googlePropertyId &&
                                                touched?.googlePropertyId
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
                                className="btn btn-primary me-2 w-100"
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
