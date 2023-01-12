import React, { useEffect, useState, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { utils } from "ethers";
import { withPendingRewardSubmit } from "shared/HOC/reward";
import { useEnabledRewardTypesQuery } from "shared/HOC/reward-types";
import Enums from "enums";
import { useEnabledAdminDiscordChannelsQuery } from "@shared/HOC/settings";
import { useCallback } from "react";

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

const RewardSchema = object().shape({
    // wallet: string()
    //     .required()
    //     .test("valid address", "Wallet Address is not valid", function () {
    //         if (utils.isAddress(this.parent.wallet)) return true;
    //         else return false;
    //     }),
    quantity: number().required().min(1),
});

const AddRewardToUser = ({ isSubmitting, onSubmit, mutationError }) => {
    const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery();
    const [discordChannels, isLoadingDiscordChannels] = useEnabledAdminDiscordChannelsQuery();

    const [initialValues, initialValuesSet] = useState({
        username: "",
        type: "Wallet",
        rewardTypeId: -1,
        quantity: 1,
        postInDiscordChannels: [],
        generatedURL: "",
    });

    const [avatar, setAvatar] = useState(null);
    const generatedRef = useRef();

    useEffect(async () => {
        let ava = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(ava);
    }, []);

    const isSubmitButtonDisabled = (values) => {
        if (
            isSubmitting ||
            values.rewardTypeId === -1 ||
            values.username.trim().length < 1 ||
            values.quantity < 1
        ) {
            return true;
        }
        return false;
    };

    const getPreviewImage = useCallback((values, rewardTypes) => {
        if (!rewardTypes) {
            return null;
        }
        let selectedReward = rewardTypes.find(
            (r) => parseInt(r.id) === parseInt(values.rewardTypeId)
        );

        if (!selectedReward || selectedReward?.rewardPreview.trim().length < 1) {
            return null;
        }

        let srcImage = selectedReward?.rewardPreview;
        return (
            <div className="card items">
                <div className="card-body">
                    <img src={srcImage} alt="reward-preview" />
                </div>
            </div>
        );
    });

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={RewardSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={async (fields, { setStatus, setErrors, resetForm, setFieldValue }) => {
                // resetForm({});
                alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
                // console.log(fields);
                const res = await onSubmit(fields);

                if (res.data?.isError) {
                    generatedRef.current.value = "";
                    setStatus(res.data?.message);
                } else {
                    resetForm();
                    setFieldValue("postInDiscordChannels", []);
                    generatedRef.current.value = `${res.data.embededLink}`;

                    if (res.data.errorArray) {
                        let statusArray = "";
                        res.data.errorArray.map((e) => {
                            statusArray = statusArray + `${e.error}`;
                        });
                        setStatus(statusArray);
                    }
                }
            }}
        >
            {({ errors, status, touched, values, setFieldValue }) => {
                return (
                    <Form>
                        <div className="row justify-content-center">
                            <div className="col-xxl-6 col-xl-6 col-lg-6">
                                <h4 className="card-title mb-3">Reward</h4>
                                <div className="card">
                                    <div className="card-body">
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
                                                        <h5 className="mb-0">Reward User</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Type of social media account  */}
                                            <div className="col-6 mb-3">
                                                <label className="form-label">Type</label>
                                                <Field
                                                    name="type"
                                                    as="select"
                                                    className={"form-control"}
                                                >
                                                    <option value="Wallet">Wallet</option>
                                                    <option value="Discord">Discord</option>
                                                    <option value="Twitter">Twitter</option>
                                                </Field>
                                            </div>

                                            {/* Username Input  */}
                                            <div className="col-12 mb-3">
                                                <label className="form-label">
                                                    User (Wallet / Discord User abc#1234 / Twitter
                                                    User)
                                                </label>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    className={
                                                        "form-control" +
                                                        (errors?.username && touched?.username
                                                            ? " is-invalid"
                                                            : "")
                                                    }
                                                />
                                                <ErrorMessage
                                                    name="username"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                            </div>

                                            {/* Type of Reward */}
                                            <div className="col-6 mb-3">
                                                <label className="form-label">Reward Type</label>
                                                <Field
                                                    name="rewardTypeId"
                                                    as="select"
                                                    className={"form-control"}
                                                >
                                                    <option key={-1} value={-1}>
                                                        Select A Reward
                                                    </option>
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
                                                    className={"form-control"}
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
                                            {discordChannels && discordChannels.length > 0 && (
                                                <>
                                                    <div className="col-12">
                                                        <label className="form-label">
                                                            Post To Discord
                                                        </label>
                                                    </div>

                                                    {discordChannels.map((d, index) => {
                                                        return (
                                                            <div className="col-12" key={index}>
                                                                <div className="form-check form-switch">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={
                                                                            values
                                                                                ?.postInDiscordChannels[
                                                                                index
                                                                            ]?.toPost
                                                                        }
                                                                        name="postInDiscordChannels"
                                                                        onChange={(event) => {
                                                                            let toPost =
                                                                                event.target
                                                                                    .checked;

                                                                            let postToThisChannel =
                                                                                {
                                                                                    channel:
                                                                                        d.channel,
                                                                                    channelId:
                                                                                        d.channelId,
                                                                                    toPost,
                                                                                };

                                                                            let tmp =
                                                                                values.postInDiscordChannels.filter(
                                                                                    (r) =>
                                                                                        r?.channelId !==
                                                                                        postToThisChannel.channelId
                                                                                );

                                                                            if (toPost) {
                                                                                tmp = [
                                                                                    ...tmp,
                                                                                    postToThisChannel,
                                                                                ];
                                                                            }

                                                                            setFieldValue(
                                                                                "postInDiscordChannels",
                                                                                tmp
                                                                            );
                                                                        }}
                                                                    />
                                                                    {d.channel}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {errors && (
                                                <div className="text-red-500">
                                                    {" "}
                                                    {errors?.message}
                                                </div>
                                            )}
                                            <div className="text-red-500">
                                                {status && "API error: " + status}
                                            </div>
                                        </div>
                                        <div className="col-4 mt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary me-2 w-100"
                                                // disabled={isSubmitButtonDisabled(values)}
                                            >
                                                {isSubmitting ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-6">
                                <h4 className="card-title mb-3">Preview</h4>
                                {getPreviewImage(values, rewardTypes)}
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default withPendingRewardSubmit(AddRewardToUser);
