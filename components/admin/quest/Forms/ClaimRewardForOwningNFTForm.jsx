import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate, { AdminQuestFormikWrapper, Wrapper } from "./QuestFormTemplate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FormControl, FormLabel, FormErrorMessage, Input, GridItem } from "@chakra-ui/react";

const OwningNftQuestSchema = object().shape({
    extendedQuestData: object().shape({
        nft: string().required("A nft name is required!"),
        contract: string().required("A contract address is required!"),
        chain: string().required("A chain network is required!"),
    }),
    text: string().required("Quest text is required"),
    completedText: string().required("Complete Text is required"),
    quantity: number().required().min(0), //optional
});

const ClaimRewardForOwningNFTForm = ({
    quest = null,
    rewardTypes,
    closeModal,
    isCreate = false,
    isLoading,
    mutationError,
    onUpsert,
}) => {
    const initialValues = {
        type: Enums.OWNING_NFT_CLAIM,
        extendedQuestData: quest?.extendedQuestData ?? {
            nft: "",
            contract: "",
            chain: "",
            collaboration: "",
            others: "",
        },
        text: quest?.text || "NFT Owner Claim Reward",
        description:
            quest?.description ?? "Allow the user to claim reward for owning a particular NFT",
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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={OwningNftQuestSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                const childrenProps = {
                    isCreate,
                    text: "Own NFT Quest",
                    isLoading,
                    status,
                    closeModal,
                };
                return (
                    <AdminQuestFormikWrapper {...childrenProps}>
                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    NFT name
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.nft"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.nft">
                                    {errors.extendedQuestData?.nft}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Contract Address
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.contract"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.contract">
                                    {errors.extendedQuestData?.contract}
                                </FormErrorMessage>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={1}>
                            <FormControl>
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Chain (mainnet, polygon)
                                </FormLabel>
                                <Field
                                    name="extendedQuestData.chain"
                                    type="text"
                                    as={Input}
                                    fontSize="md"
                                    variant="riftly"
                                    ms="4px"
                                />

                                <FormErrorMessage fontSize="md" name="extendedQuestData.chain">
                                    {errors.extendedQuestData?.chain}
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

export default withQuestUpsert(ClaimRewardForOwningNFTForm);
