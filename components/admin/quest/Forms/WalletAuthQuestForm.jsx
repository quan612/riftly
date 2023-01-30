import Enums from "enums";
import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper } from "./QuestFormTemplate";

const WalletQuestSchema = object().shape({
    text: string().required("Quest text is required"),
    completedText: string().required("Completed Text is required"),
    quantity: number().required().min(0), // optional
});

const WalletAuthQuestForm = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.WALLET_AUTH,
        text: quest?.text || "Authenticate your Wallet",
        description: quest?.description ?? "Require the user to authenticate with a crypto wallet",
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
            validationSchema={WalletQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setStatus }) => {
                // alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
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
                    text: "Wallet Authenticate",
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

export default withQuestUpsert(WalletAuthQuestForm);
