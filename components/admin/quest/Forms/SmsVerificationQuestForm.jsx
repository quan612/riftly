import Enums from "enums";
import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper, Wrapper } from "./QuestFormTemplate";
import { Text } from "@chakra-ui/react";

const SmsQuestSchema = object().shape({
    text: string().required("Quest text is required"),
    completedText: string().required("Completed Text is required"),
    quantity: number().required().min(0), // optional
});

const SmsVerificationQuestForm = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.SMS_VERIFICATION,
        text: quest?.text || "Verification with Sms",
        description: quest?.description ?? "Allow the user to authenticate with Sms",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? true,
        id: quest?.id || 0,
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={SmsQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setStatus }) => {
                try {
                    let res = await onUpsert(fields);

                    if (res.data.isError) {
                        setStatus(res.data.message);
                    } else {
                        closeModal();
                    }
                } catch (error) {}
            }}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                const childrenProps = {
                    isCreate,
                    text: "Sms Verification",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
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
                    </AdminQuestFormikWrapper>
                );
            }}
        </Formik>
    );
};

export default withQuestUpsert(SmsVerificationQuestForm);
