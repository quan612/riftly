import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import DatePicker from "react-datepicker";
import QuestFormTemplate from "./QuestFormTemplate";
import "react-datepicker/dist/react-datepicker.css";

const ImageUploadQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.IMAGE_UPLOAD_QUEST,
        extendedQuestData: quest?.extendedQuestData ?? {
            eventName: "",
            discordChannel: "",
            collaboration: "",
            // endDate: "",
        },
        text: quest?.text || "An app submission for #SUBMISSION",
        description: quest?.description ?? "Allow the user to upload their submission",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };
    const ImageUploadSchema = object().shape({
        extendedQuestData: object().shape({
            eventName: string().required("An event name is required!"),
            discordChannel: string().required("An discord channel Id is required!"),
            // endDate: string().required("An end date is required!"),
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
            validationSchema={ImageUploadSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create an app submission</small>
                        <div className="row">
                            {/* Anomura Event */}
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Event Name (No spaces)</label>
                                <Field
                                    name={`extendedQuestData.eventName`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                        errors?.extendedQuestData?.eventName &&
                                        touched?.extendedQuestData?.eventName
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.eventName`}
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Discord Channel</label>
                                <Field
                                    name={`extendedQuestData.discordChannel`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData?.discordChannel &&
                                        touched.extendedQuestData?.discordChannel
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.discordChannel`}
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Collaboration</label>
                                <Field
                                    name={`extendedQuestData.collaboration`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData?.collaboration &&
                                        touched.extendedQuestData?.collaboration
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.collaboration`}
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

export default withQuestUpsert(ImageUploadQuest);
