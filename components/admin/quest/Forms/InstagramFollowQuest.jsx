import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";

const InstagramFollowQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.FOLLOW_INSTAGRAM,
        extendedQuestData: quest?.extendedQuestData ?? { followAccount: "", collaboration: "" },
        text: quest?.text || "Follow Instagram Account",
        description: quest?.description ?? "Require the user to follow an Instagram Account",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };
    const InstagramFollowQuestSchema = object().shape({
        extendedQuestData: object().shape({
            followAccount: string().required("An Instagram account is required!"),
        }),
        text: string().required("Quest text is required"),
        completedText: string().required("Complete Text is required"),
        quantity: number().required().min(0), //optional
    });

    const onSubmit = async (fields, { setStatus }) => {
        try {
            let res = await onUpsert(fields);

            if (res.data.isError) {
                setStatus(res.data.message);
            } else {
                closeModal();
            }
        } catch (error) {}
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={InstagramFollowQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create an Instagram Follow Requirement</small>
                        <div className="row">
                            {/* Follow Instagram Account */}
                            <div className="col-xxl-12 col-xl-12 col-lg-12">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">
                                        Follow Instagram Account (anomuragame)
                                    </label>
                                    <Field
                                        name="extendedQuestData.followAccount"
                                        type="text"
                                        className={
                                            "form-control" +
                                            (errors?.extendedQuestData &&
                                            errors?.extendedQuestData?.followAccount &&
                                            touched?.extendedQuestData?.followAccount
                                                ? " is-invalid"
                                                : "")
                                        }
                                    />
                                    <ErrorMessage
                                        name="extendedQuestData.followAccount"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>
                            </div>

                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    Part of Collaboration (colormonsters, leave blank if not
                                    collaborate)
                                </label>
                                <Field
                                    name="extendedQuestData.collaboration"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                        errors?.extendedQuestData?.collaboration &&
                                        touched?.extendedQuestData?.collaboration
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="extendedQuestData.collaboration"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <QuestFormTemplate
                                values={values}
                                errors={errors}
                                touched={touched}
                                onTextChange={(t) => setFieldValue("text", t)}
                                onCompletedTextChange={(c) => setFieldValue("completedText", c)}
                                onDescriptionChange={(d) => setFieldValue("description", d)}
                                onRewardTypeChange={(rt) => setFieldValue("rewardTypeId", rt)}
                                onRewardQuantityChange={(rq) => setFieldValue("quantity", rq)}
                                onIsEnabledChange={handleChange}
                                rewardTypes={rewardTypes}
                            />

                            <div
                                className={`col-12 mb-3 text-danger ${
                                    status ? "d-block" : "d-none"
                                }`}
                            >
                                <label className="form-label">API error: {status}</label>
                            </div>

                            <div className="col-12 mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default withQuestUpsert(InstagramFollowQuest);
