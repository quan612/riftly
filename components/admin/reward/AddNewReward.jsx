import React, { useEffect, useState, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { utils } from "ethers";
import { withRewardTypeQuery, withPendingRewardSubmit } from "shared/HOC/reward";
import Enums from "enums";

const avatars = [
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava1.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava2.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava3.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava4.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava5.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava6.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava7.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava8.png`,
];

const initialValues = {
    username: "",
    type: "Wallet",
    // wallet: "",
    rewardTypeId: 1,
    quantity: 1,
    postInBotChannel: false,
    postInGeneralChannel: false,
    generatedURL: "",
};

const RewardSchema = object().shape({
    // wallet: string()
    //     .required()
    //     .test("valid address", "Wallet Address is not valid", function () {
    //         if (utils.isAddress(this.parent.wallet)) return true;
    //         else return false;
    //     }),
    quantity: number().required().min(1),
});

const AddNewReward = ({
    isFetchingRewardType,
    rewardTypes,
    isSubmitting,
    onSubmit,
    mutationError,
}) => {
    const [avatar, setAvatar] = useState(null);
    const generatedRef = useRef();

    useEffect(async () => {
        let ava = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(ava);
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={RewardSchema}
            validateOnBlur={true}
            validateOnChange={false}
            onSubmit={async (fields, { setErrors, resetForm }) => {
                //alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
                const res = await onSubmit(fields);

                if (res.data?.isError) {
                    generatedRef.current.value = "";
                    setErrors({
                        username: res.data?.message,
                    });
                } else {
                    let user = res.data.user.wallet;
                    resetForm();
                    generatedRef.current.value = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}${Enums.BASEPATH}/claim/${user}?specialcode=${res.data.generatedURL}`;
                }
            }}
        >
            {({ errors, status, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-xxl-12">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    className="me-3 rounded-circle me-0 me-sm-3"
                                    src={avatar}
                                    width="55"
                                    height="55"
                                    alt=""
                                />
                                <div className="media-body">
                                    <h5 className="mb-0">Add a new reward</h5>
                                </div>
                            </div>
                        </div>

                        {/* Type of social media account  */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Type</label>
                            <Field name="type" as="select" className={"form-control"}>
                                <option value="Twitter">Wallet</option>
                                <option value="Discord">Discord</option>
                                <option value="Twitter">Twitter</option>
                            </Field>
                        </div>

                        {/* Username Input  */}
                        <div className="col-12 mb-3">
                            <label className="form-label">
                                User (Wallet / Discord User abc#1234 / Twitter User)
                            </label>
                            <Field
                                name="username"
                                type="text"
                                className={
                                    "form-control" +
                                    (errors?.size && touched?.size ? " is-invalid" : "")
                                }
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="invalid-feedback"
                            />
                        </div>

                        {/* Wallet 
                        <div className="col-12 mb-3">
                            <label className="form-label">Wallet Address</label>
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
                        </div> */}

                        {/* Type of Reward */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Reward Type</label>
                            <Field
                                name="rewardTypeId"
                                as="select"
                                className={
                                    "form-control" +
                                    (errors.price && touched.price ? " is-invalid" : "")
                                }
                            >
                                {rewardTypes &&
                                    rewardTypes.map((type, index) => {
                                        return (
                                            <option key={index} value={type.id}>
                                                {type.reward}
                                            </option>
                                        );
                                    })}
                            </Field>
                        </div>

                        {/* Reward quantity  */}
                        <div className="col-6 mb-3">
                            <label className="form-label">Quantity</label>
                            <Field
                                name="quantity"
                                type="number"
                                className={
                                    "form-control" +
                                    (errors.quantity && touched.quantity ? " is-invalid" : "")
                                }
                            />
                            <ErrorMessage
                                name="quantity"
                                component="div"
                                className="invalid-feedback"
                            />
                        </div>

                        {/* URL to claim */}
                        <div className="col-12 mb-3">
                            <label className="form-label">Generated URL</label>
                            <input
                                name="generatedURL"
                                type="text"
                                className={"form-control"}
                                disabled={true}
                                ref={generatedRef}
                            />
                        </div>

                        {/* Post on discord server */}
                        <div className="col-12">
                            <label className="form-label">Show in Discord</label>
                        </div>
                        <div className="col-12">
                            <label className="form-label mr-2">
                                <Field name="postInBotChannel" type="checkbox" className="mr-2" />
                                Bot channel
                            </label>
                            <label className="form-label">
                                <Field
                                    name="postInGeneralChannel"
                                    type="checkbox"
                                    className="mr-2"
                                />
                                #deepsea-treasures
                            </label>
                        </div>
                        {errors && <div className="text-red-500"> {errors.username}</div>}
                    </div>

                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary mr-2 w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

const firstHOC = withPendingRewardSubmit(AddNewReward);
export default withRewardTypeQuery(firstHOC);
