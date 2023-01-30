import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper, Wrapper } from "./QuestFormTemplate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FormControl, FormLabel, FormErrorMessage, Input, GridItem } from "@chakra-ui/react";

const CodeQuestSchema = object().shape({
    extendedQuestData: object().shape({
        codeEvent: string().required("An unique event is needed!"),
        // endDate: string().required("An end date is required!"),
        secretCode: string().required("A secret code is required!"),
    }),
    text: string().required("Quest text is required"),
    completedText: string().required("Complete Text is required"),
    quantity: number().required().min(0), //optional
});

const CodeQuestForm = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.CODE_QUEST,
        extendedQuestData: quest?.extendedQuestData ?? {
            codeEvent: "",
            endDate: "",
            secretCode: "",
            collaboration: "",
            others: "",
        },
        text: quest?.text || "Code Quest For Event",
        description: quest?.description ?? "Allow the user to enter a code and claim $SHELL",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };

    const onSubmit = async (fields, { setStatus }) => {
        try {
            //alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));

            let res = await onUpsert(fields);

            if (res?.data?.isError) {
                setStatus(res.data.message);
            } else {
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={CodeQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                const childrenProps = {
                    isCreate,
                    text: "Code Quest Event",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Unique Event Name
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.codeEvent"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.codeEvent">
                                    {errors.extendedQuestData?.codeEvent}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    End Date
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.endDate"
                                    // type="text"

                                    // fontSize="md"
                                    variant="riftly"
                                    // ms="4px"
                                >
                                    {({ field, meta, form: { setFieldValue } }) => {
                                        return (
                                            <DatePicker
                                                autoComplete="off"
                                                background="red"
                                                {...field}
                                                utcOffset={0}
                                                // dateFormat="yyyy-MM-dd"
                                                dateFormat="MM/dd/yyyy"
                                                selected={
                                                    (field.value && new Date(field.value)) || null
                                                }
                                                onChange={(val) => {
                                                    setFieldValue(`extendedQuestData.endDate`, val);
                                                }}
                                            />
                                        );
                                    }}
                                </Field>
                                <FormErrorMessage fontSize="md" name="extendedQuestData.contract">
                                    {errors.extendedQuestData?.contract}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Secret Code
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.secretCode"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.secretCode">
                                    {errors.extendedQuestData?.secretCode}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Other Answers (answer 1,answer 2,answer 3)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.otherAnswers"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />
                            </FormControl>
                        </GridItem>

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

export default withQuestUpsert(CodeQuestForm);
