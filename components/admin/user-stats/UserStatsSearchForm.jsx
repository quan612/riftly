import React from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";

const initialValues = {
    contract: "",
    wallet: "",
    chainId: "eth",
};

const chains = ["eth", "polygon", "bsc", "avalance", "fantom"];

const SearchInfoSchema = object().shape({});

const UserStatsSearchForm = ({ onFormSubmit }) => {
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={SearchInfoSchema}
                onSubmit={async (fields) => {
                    onFormSubmit(fields);
                }}
                validateOnBlur={true}
                validateOnChange={false}
            >
                {({ formik, errors, status, touched, values }) => {
                    return (
                        <Form>
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">Contract</label>
                                    <Field name="contract" type="text" className={"form-control"} />
                                </div>
                                {/* Type of Chain */}
                                <div className="col-6 mb-3">
                                    <label className="form-label">Chain</label>
                                    <Field name="chainId" as="select" className={"form-control"}>
                                        {chains.map((type, index) => {
                                            return (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            );
                                        })}
                                    </Field>
                                </div>

                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">Wallet</label>
                                    <Field name="wallet" type="text" className={"form-control"} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <button className="btn btn-primary mr-2" type="submit">
                                    Search
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default UserStatsSearchForm;
