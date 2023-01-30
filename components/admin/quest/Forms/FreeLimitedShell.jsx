import Enums from "enums";
import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper } from "./QuestFormTemplate";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Switch,
    Select,
    Checkbox,
    GridItem,
} from "@chakra-ui/react";

const FreeTokenQuestSchema = object().shape({
    text: string().required("Quest text is required"),
    completedText: string().required("Completed Text is required"),
    quantity: number().required().min(0), // optional
});

const FreeLimitedShell = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.LIMITED_FREE_SHELL,
        extendedQuestData: quest?.extendedQuestData ?? { collaboration: "" },
        text: quest?.text || "Free limited $SHELL.",
        description: quest?.description ?? "Free shell seasonal",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? true,
        id: quest?.id || 0,
    };

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
            validationSchema={FreeTokenQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                const childrenProps = {
                    isCreate,
                    text: "Seasonal Free Limited Token",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Collaboration (leaving blank for non specific collaboration)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.collaboration"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />
                            </FormControl>
                        </GridItem>

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

export default withQuestUpsert(FreeLimitedShell);
