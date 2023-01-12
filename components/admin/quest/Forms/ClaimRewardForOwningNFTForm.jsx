import Enums from "enums";
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { withQuestUpsert } from "shared/HOC/quest";
import QuestFormTemplate from "./QuestFormTemplate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
                return (
                    <Form>
                        <h4 className="card-title mb-3">{isCreate ? "Create" : "Edit"} Quest</h4>
                        <small>Create a Owning NFT Quest Event</small>
                        <div className="row">
                            {/* Owning NFT Quest */}
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    NFT name (to be accessed as /nft-quest?nft=)
                                </label>
                                <Field
                                    name={`extendedQuestData.nft`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData?.nft &&
                                        touched.extendedQuestData?.nft
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.name`}
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Contract Address</label>
                                <Field
                                    name={`extendedQuestData.contract`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData?.contract &&
                                        touched.extendedQuestData?.contract
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.contract`}
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Chain</label>
                                <Field
                                    name={`extendedQuestData.chain`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors.extendedQuestData &&
                                        errors.extendedQuestData?.chain &&
                                        touched.extendedQuestData?.chain
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.chain`}
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">
                                    Collaboration (leaving blank for non specific collaboration)
                                </label>
                                <Field
                                    name={`extendedQuestData.collaboration`}
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.extendedQuestData &&
                                        errors?.extendedQuestData?.collaboration &&
                                        touched?.extendedQuestData?.collaboration
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name={`extendedQuestData.collaboration`}
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
                                    {isLoading ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
                                    disabled={isLoading}
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

export default withQuestUpsert(ClaimRewardForOwningNFTForm);
