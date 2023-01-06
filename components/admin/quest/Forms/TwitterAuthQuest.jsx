import Enums from "enums";
import React from "react";
import { Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";

const TwitterAuthQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.TWITTER_AUTH,
        text: quest?.text || "Authenticate your Twitter",
        description: quest?.description ?? "Require the user to authenticate their Twitter Id",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? true,
        id: quest?.id || 0,
    };
    const TwitterQuestSchema = object().shape({
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
            validationSchema={TwitterQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create a Twitter Authentication Requirement</small>
                        <div className="row">
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

                            <div className="col-12 my-3">
                                <button
                                    type="submit"
                                    className="btn btn-success mr-2"
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

export default withQuestUpsert(TwitterAuthQuest);
