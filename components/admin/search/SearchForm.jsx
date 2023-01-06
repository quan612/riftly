import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";
import MultiSelect from "@components/admin/elements/MultiSelect";
import { withRewardTypeQuery } from "shared/HOC/reward";

const initialValues = {
    wallet: "",
    userId: "",
    twitter: "",
    discord: "",
    rewards: [],
    listId: "None",
};

const lists = ["None", "WhiteList"];

const SearchInfoSchema = object().shape({
    rewards: array().of(
        object().shape({
            type: string().required(),
            typeId: number(),
            minQty: number().required().min(0),
            maxQty: number().required().min(0),
        })
    ),
});

const SearchForm = ({ onFormSubmit, rewardTypes }) => {
    const [rewardTypeItems, setRewardTypes] = useState(rewardTypes);

    useEffect(async () => {
        if (rewardTypes) {
            let rewards = [];
            rewardTypes.forEach((reward) => {
                rewards.push({
                    id: reward.id,
                    name: reward.reward,
                });
            });
            setRewardTypes(rewards);
        }
    }, [rewardTypes]);
    const validateQty = (rewards, index) => {
        let error = null;

        if (parseInt(rewards[index].minQty) > parseInt(rewards[index].maxQty)) {
            error = `Min token cannot be larger than max token for ${rewards[index].type}`;
        }

        return error;
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={SearchInfoSchema}
                onSubmit={(fields) => {
                    onFormSubmit(fields);
                }}
                validateOnBlur={true}
                validateOnChange={false}
            >
                {({ formik, errors, status, touched, values }) => {
                    return (
                        <Form>
                            <div className="row">
                                <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                    <label className="form-label">Wallet</label>
                                    <Field
                                        name="wallet"
                                        type="text"
                                        className={
                                            "form-control" +
                                            (errors.wallet && touched.wallet ? " is-invalid" : "")
                                        }
                                    />
                                    <ErrorMessage
                                        name="wallet"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </div>

                                <div className="col-xxl-3 col-xl-3 col-lg-3 mb-3">
                                    <label className="form-label">Twitter Username</label>
                                    <Field name="twitter" type="text" className={"form-control"} />
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 mb-3">
                                    <label className="form-label">Discord Discriminator </label>
                                    <Field name="discord" type="text" className={"form-control"} />
                                </div>

                                <FieldArray name="rewards">
                                    {(arrayHelpers) => (
                                        <>
                                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3 flex items-center">
                                                <label className="form-label mr-3">Rewards</label>

                                                <MultiSelect
                                                    items={rewardTypeItems}
                                                    onSelectedItem={(item) => {
                                                        arrayHelpers.push({
                                                            type: item.name,
                                                            typeId: item.id,
                                                            minQty: 1,
                                                            maxQty: 10,
                                                        });
                                                    }}
                                                    onDeSelectedItem={(item) => {
                                                        let index = values.rewards.findIndex(
                                                            (el) => el.type === item
                                                        );

                                                        arrayHelpers.remove(index);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-2 mb-3 flex items-center">
                                                <label className="form-label">Min</label>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-2 mb-3 flex items-center">
                                                <label className="form-label">Max</label>
                                            </div>

                                            {values.rewards &&
                                                values.rewards.map((item, index) => {
                                                    const fieldName = `rewards.[${index}]`;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                                                <Field
                                                                    name={`${fieldName}.type`}
                                                                    type="text"
                                                                    className={"form-control"}
                                                                    disabled={true}
                                                                />
                                                                <ErrorMessage
                                                                    name={`${fieldName}.minQty`}
                                                                    component="div"
                                                                    className="text-red-500"
                                                                />
                                                            </div>

                                                            <div className="col-xxl-2 col-xl-2 col-lg-2 mb-3">
                                                                <Field
                                                                    name={`${fieldName}.minQty`}
                                                                    type="text"
                                                                    className={
                                                                        "form-control" +
                                                                        (errors.rewards &&
                                                                        errors.rewards[index] &&
                                                                        touched.rewards[index]
                                                                            ? " is-invalid"
                                                                            : "")
                                                                    }
                                                                    validate={() =>
                                                                        validateQty(
                                                                            values.rewards,
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="col-xxl-2 col-xl-2 col-lg-2 mb-3">
                                                                <Field
                                                                    name={`${fieldName}.maxQty`}
                                                                    type="text"
                                                                    className={
                                                                        "form-control" +
                                                                        (errors.rewards &&
                                                                        errors.rewards[index] &&
                                                                        touched.rewards[index]
                                                                            ? " is-invalid"
                                                                            : "")
                                                                    }
                                                                    validate={() =>
                                                                        validateQty(
                                                                            values.rewards,
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                        </>
                                    )}
                                </FieldArray>

                                {/* Type of List */}
                                {/* <div className="col-6 mb-3">
                                    <label className="form-label">List</label>
                                    <Field name="listId" as="select" className={"form-control"}>
                                        {lists.map((type, index) => {
                                            return (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            );
                                        })}
                                    </Field>
                                </div> */}
                            </div>

                            <div className="mt-3">
                                <button className="btn btn-primary mr-2" type="submit">
                                    Search
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default withRewardTypeQuery(SearchForm);
