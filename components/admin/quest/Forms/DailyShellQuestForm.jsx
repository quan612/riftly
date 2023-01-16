import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";

/**
 * This is for sub directory of quest for claiming free $SHELL per frequent
 */
const DailyShellQuestForm = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.DAILY_SHELL,
        extendedQuestData: quest?.extendedQuestData ?? { frequently: "", questRule: "" },
        text: quest?.text || "Daily Free $SHELL",
        description: quest?.description ?? "Allow user to claim free shell on frequently basis",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };
    const DailyShellQuestSchema = object().shape({
        extendedQuestData: object().shape({
            frequently: string().required("A frequently identity is required!"),
            questRule: string().required("A rule identity is required!"),
        }),
        text: string().required("Quest text is required"),
        completedText: string().required("Complete Text is required"),
        quantity: number().required().min(0), //optional
    });

    const onSubmit = async (fields, { setStatus }) => {
        try {
            let res = await onUpsert(fields);

            if (res?.data?.isError) {
                setStatus(res.data.message);
            } else {
                closeModal();
            }
        } catch (error) {}
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={DailyShellQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create a free $SHELL Daily quest</small>
                        <div className="row">
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    Frequent Rule (Enter 'daily/hourly/weekly' for rule)
                                </label>
                                <Field
                                    name="extendedQuestData.frequently"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                        errors?.extendedQuestData?.frequently &&
                                        touched?.extendedQuestData?.frequently
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="extendedQuestData.frequently"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    Quest Rule (Enter 'any' for rule)
                                </label>
                                <Field
                                    name="extendedQuestData.questRule"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData.questRule &&
                                        touched.extendedQuestData.questRule
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="extendedQuestData.questRule"
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

export default withQuestUpsert(DailyShellQuestForm);
