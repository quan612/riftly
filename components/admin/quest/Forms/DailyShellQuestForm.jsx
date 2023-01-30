import Enums from "enums";
import React from "react";
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

const DailyShellQuestSchema = object().shape({
    extendedQuestData: object().shape({
        frequently: string().required("A frequently identity is required!"),
        questRule: string().required("A rule identity is required!"),
    }),
    text: string().required("Quest text is required"),
    completedText: string().required("Complete Text is required"),
    quantity: number().required().min(0), //optional
});

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
                const childrenProps = {
                    isCreate,
                    text: "Free Daily Token",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Frequent Rule (Enter 'daily/hourly/weekly' for rule)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.frequently"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.frequently">
                                    {errors.extendedQuestData?.frequently}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Quest Rule (Enter 'any' for rule)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.questRule"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.questRule">
                                    {errors.extendedQuestData?.questRule}
                                </FormErrorMessage>
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

export default withQuestUpsert(DailyShellQuestForm);
