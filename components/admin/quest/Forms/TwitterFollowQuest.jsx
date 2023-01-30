import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper } from "./QuestFormTemplate";
import { FormControl, FormLabel, FormErrorMessage, Input, GridItem } from "@chakra-ui/react";

const TwitterFollowQuestSchema = object().shape({
    extendedQuestData: object().shape({
        followAccount: string().required("A Twitter account is required!"),
    }),
    text: string().required("Quest text is required"),
    completedText: string().required("Complete Text is required"),
    quantity: number().required().min(0), //optional
});

const TwitterFollowQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.FOLLOW_TWITTER,
        extendedQuestData: quest?.extendedQuestData ?? { followAccount: "", collaboration: "" },
        text: quest?.text || "Follow Twitter Account",
        description: quest?.description ?? "Require the user to follow a Twitter Account",
        completedText: quest?.completedText || "Completed",
        rewardTypeId: quest?.rewardTypeId || 1,
        quantity: quest?.quantity || 0,
        isEnabled: quest?.isEnabled ?? true,
        isRequired: quest?.isRequired ?? false,
        id: quest?.id || 0,
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={TwitterFollowQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setStatus }) => {
                try {
                    let res = await onUpsert(fields);

                    if (res?.data?.isError) {
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
                    text: "Follow Twitter Account",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Twitter Account (whale.drop)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.followAccount"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage
                                    fontSize="md"
                                    name="extendedQuestData.followAccount"
                                >
                                    {errors.extendedQuestData?.followAccount}
                                </FormErrorMessage>
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

export default withQuestUpsert(TwitterFollowQuest);
