import Enums from "enums";
import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";

const JoinDiscordQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.JOIN_DISCORD,
        extendedQuestData: quest?.extendedQuestData ?? { discordServer: "", collaboration: "" },
        text: quest?.text || "Join Our Discord",
        description: quest?.description ?? "Let user join our discord",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? true,
        id: quest?.id || 0,
    };

    const JoinDiscordSchema = object().shape({
        extendedQuestData: object().shape({
            discordServer: string().required("A discord server id is required!"),
        }),
        text: string().required("Quest text is required"),
        completedText: string().required("Completed Text is required"),
        quantity: number().required().min(0), // optional
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
            validationSchema={JoinDiscordSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Join Discord Requirement</small>
                        <div className="row">
                            {/* Join Discord */}

                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    Join Discord Server (colormonsters)
                                </label>
                                <Field
                                    name="extendedQuestData.discordServer"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                        errors?.extendedQuestData?.discordServer &&
                                        touched?.extendedQuestData?.discordServer
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="extendedQuestData.discordServer"
                                    component="div"
                                    className="invalid-feedback"
                                />
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
                                        errors?.extendedQuestData.collaboration &&
                                        touched?.extendedQuestData.collaboration
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
                                className={`col-12 mb-3 text-red-500 ${
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
                                    {isLoading ? "Saving" : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
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

export default withQuestUpsert(JoinDiscordQuest);
