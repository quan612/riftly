import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper } from "./QuestFormTemplate";
import { FormControl, FormLabel, FormErrorMessage, Input, GridItem } from "@chakra-ui/react";
const TwitterRetweetQuestSchema = object().shape({
    extendedQuestData: object().shape({
        tweetId: string().required("An id of the tweet is required!"),
    }),
    text: string().required("Quest text is required"),
    completedText: string().required("Complete Text is required"),
    quantity: number().required().min(0), //optional
});

const TwitterRetweetQuest = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.TWITTER_RETWEET,
        extendedQuestData: quest?.extendedQuestData ?? { tweetId: "", collaboration: "" },
        text: quest?.text || "Retweet a Tweet",
        description: quest?.description ?? "Require the user to retweet a Tweet",
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
            validationSchema={TwitterRetweetQuestSchema}
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
                    text: "Twitter Retweet",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Tweet Id (Enter id ~ 1597626502308306949)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.tweetId"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.tweetId">
                                    {errors.extendedQuestData?.tweetId}
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

export default withQuestUpsert(TwitterRetweetQuest);
