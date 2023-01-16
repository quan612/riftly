import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { debounce } from "utils/";

import { useAdminRewardTypeMutation, useRewardTypesQuery } from "@shared/HOC/reward-types";

const AdminRewardTypes = () => {
    const [rewardTypes, isLoadingRewardTypes] = useRewardTypesQuery();
    const [data, isUpserting, upsertRewardTypeAsync] = useAdminRewardTypeMutation();

    const [createRewardType, createRewardTypeSet] = useState({
        id: -1,
        reward: "",
        rewardPreview: "",
        rewardIcon: "",
        isUpdating: false,
        isEnabled: true,
    });

    return (
        <div className="row">
            <div className="col-xxl-12">
                <h4 className="card-title mb-3">Create Reward Type</h4>
                <div className="card">
                    <div className="card-body">
                        <CreateRewardTypes
                            upsertRewardTypeAsync={upsertRewardTypeAsync}
                            createRewardType={createRewardType}
                            createRewardTypeSet={createRewardTypeSet}
                        />
                    </div>
                </div>
            </div>
            <div className="col-xl-12">
                <h4 className="card-title mb-3">Current Reward Types</h4>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive api-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Reward</th>
                                        <th>Preview</th>
                                        <th>Icon</th>
                                        <th>Enabled</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewardTypes &&
                                        rewardTypes?.map((rewardType, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{rewardType.reward}</td>
                                                    <td>
                                                        {rewardType?.rewardPreview?.length > 0 && (
                                                            <img
                                                                src={`${rewardType?.rewardPreview}`}
                                                                style={{ width: "120px" }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        {rewardType?.rewardIcon?.length > 0 && (
                                                            <img
                                                                src={`${rewardType?.rewardIcon}`}
                                                                style={{ width: "50px" }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        {rewardType?.isEnabled && (
                                                            <i
                                                                className="ri-check-line"
                                                                style={{
                                                                    fontSize: "2rem",
                                                                    color: "green",
                                                                }}
                                                            ></i>
                                                        )}
                                                        {!rewardType?.isEnabled && (
                                                            <i
                                                                className="ri-close-line"
                                                                style={{
                                                                    fontSize: "2rem",
                                                                    color: "red",
                                                                }}
                                                            ></i>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span>
                                                            <i
                                                                className="ri-edit-line ri-xl"
                                                                style={{
                                                                    fontSize: "2rem",
                                                                }}
                                                                onClick={() => {
                                                                    createRewardTypeSet({
                                                                        id: rewardType.id,
                                                                        reward: rewardType.reward,
                                                                        rewardPreview:
                                                                            rewardType.rewardPreview,
                                                                        isUpdating: true,
                                                                        isEnabled:
                                                                            rewardType.isEnabled,
                                                                    });
                                                                }}
                                                            ></i>
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRewardTypes;

function CreateRewardTypes({ upsertRewardTypeAsync, createRewardType, createRewardTypeSet }) {
    const initialValues = createRewardType;

    const CreateRewardTypeSchema = object().shape({
        reward: string().required("Reward Type is required"),
    });

    const hiddenIconFileInput = useRef(null);
    const [imageIcon, setImageIcon] = useState(null);

    function handleOnRewardIconChange(e, setFieldValue) {
        const reader = new FileReader();
        reader.onload = function (onLoadEvent) {
            setFieldValue("rewardIcon", onLoadEvent.target.result);
        };

        reader.readAsDataURL(e.target.files[0]);
        setImageIcon(e.target.files[0]);
    }

    const getButtonState = (values) => {
        if (createRewardType.isUpdating) {
            if (
                values?.reward === initialValues.reward &&
                values?.rewardPreview === initialValues.rewardPreview &&
                values?.rewardIcon === initialValues.rewardIcon &&
                values?.isEnabled === initialValues.isEnabled
            ) {
                return true;
            }
        } else {
            if (
                (values?.reward.length === 0 &&
                    values?.rewardPreview?.length === 0 &&
                    values?.rewardIcon?.length === 0) ||
                (values?.rewardPreview === initialValues.rewardPreview &&
                    values?.rewardIcon === initialValues.rewardIcon &&
                    values?.isEnabled === initialValues.isEnabled)
            )
                return true;
        }
        return false;
    };
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={CreateRewardTypeSchema}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);

                    const payload = {
                        ...fields,
                    };

                    let upsertOp = await upsertRewardTypeAsync(payload);

                    if (upsertOp.isError) {
                        setStatus(upsertOp.message);
                    } else {
                        resetForm();
                        createRewardTypeSet({
                            id: -1,
                            reward: "",
                            rewardPreview: "",
                            isUpdating: false,
                            isEnabled: true,
                        });

                        setImageIcon(null);
                    }
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm, handleChange }) => {
                    return (
                        <Form>
                            <div className="row">
                                <div className="col-xxl-3 col-xl-3 col-lg-3 mb-3">
                                    <label className="form-label">Reward Name </label>
                                    <Field
                                        name="reward"
                                        type="text"
                                        className={
                                            "form-control" +
                                            (errors?.reward && touched?.reward ? " is-invalid" : "")
                                        }
                                    />
                                    <ErrorMessage
                                        name="reward"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>
                                <div className="col-xxl-4 col-xl-4 col-lg-4 mb-3">
                                    <label className="form-label">Icon</label>
                                    <br />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            hiddenIconFileInput.current.click();
                                        }}
                                        className="btn btn-primary me-2"
                                    >
                                        <div>
                                            <span>Choose File</span>
                                        </div>
                                    </button>
                                    {imageIcon && imageIcon.name}
                                    <input
                                        type="file"
                                        name="file"
                                        accept="image/jpeg, image/png"
                                        style={{ display: "none" }}
                                        ref={hiddenIconFileInput}
                                        onChange={(e) => handleOnRewardIconChange(e, setFieldValue)}
                                    />
                                </div>
                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">
                                        Image Preview URL (For Discord Embeded)
                                    </label>
                                    <br />
                                    <Field
                                        name="rewardPreview"
                                        type="text"
                                        className={
                                            "form-control" +
                                            (errors?.rewardPreview && touched?.rewardPreview
                                                ? " is-invalid"
                                                : "")
                                        }
                                    />
                                </div>
                                <div className="col-12">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            // defaultChecked={values.isEnabled ? true : false}
                                            checked={values.isEnabled ? true : false}
                                            name="isEnabled"
                                            onChange={handleChange}
                                        />
                                        Enabled
                                    </div>
                                </div>
                                <div className="col-xxl-12 col-xl-12 col-lg-12 mb-3">
                                    <label>
                                        (Disable Reward Type would hide it from Reward User page)
                                    </label>
                                </div>
                                <div
                                    className={`col-12 mb-3 text-danger ${
                                        status ? "d-block" : "d-none"
                                    }`}
                                >
                                    <label className="form-label">API error: {status}</label>
                                </div>
                            </div>

                            <div className="mt-3">
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary me-2"
                                    disabled={getButtonState(values)}
                                >
                                    {createRewardType.isUpdating ? "Update" : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={() => {
                                        setImageIcon(null);
                                        resetForm();
                                        createRewardTypeSet({
                                            id: -1,
                                            reward: "",
                                            rewardPreview: "",
                                            isUpdating: false,
                                            isEnabled: true,
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
}
