import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { useRouter } from "next/router";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { debounce } from "utils/";

import { useAdminUserQuestsQuery, useAdminUserQuestDelete } from "@shared/HOC/user-quests";

const AdminUserQuestsSearch = () => {
    const [queryData, isQuerying, queryUserQuestsAsync] = useAdminUserQuestsQuery();
    const [deleteData, isDeleting, deleteUserQuestsAsync] = useAdminUserQuestDelete();
    const [userQuests, userQuestsSet] = useState([]);

    const handleOnQuery = async (payload) => {
        await queryUserQuestsAsync(payload);
    };

    useEffect(() => {
        if (queryData && queryData.userQuest.length > 0) {
            userQuestsSet(queryData.userQuest);
        }
    }, [queryData]);

    const getRewardedInfo = (rewardedQty, rewardType) => {
        if (rewardType?.rewardIcon?.length > 0) {
            return (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <span>{rewardedQty}</span>{" "}
                    <img src={`${rewardType?.rewardIcon}`} style={{ width: "25px" }} />
                </div>
            );
        } else {
            return rewardedQty + rewardType.reward;
        }
    };

    return (
        <div className="row">
            <div className="col-xxl-12">
                <h4 className="card-title mb-3">Search</h4>
                <div className="card">
                    <div className="card-body">
                        <SearchUserQuestForm handleOnQuery={handleOnQuery} />
                    </div>
                </div>
            </div>
            <div className="col-xl-12">
                <h4 className="card-title mb-3">Quest of User</h4>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive api-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="col-4">Quest</th>
                                        <th className="col-1">Rewarded</th>
                                        <th className="col-3">Completed</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userQuests &&
                                        userQuests.length > 0 &&
                                        userQuests.map((userQuest, index) => {
                                            const {
                                                quest,
                                                rewardType,
                                                rewardedQty,
                                                updatedAt,
                                                id,
                                                userId,
                                                questId,
                                            } = userQuest;

                                            let date = new Date(updatedAt);
                                            let updateAtInLocale =
                                                date.toLocaleDateString("en-US") +
                                                " " +
                                                date.toLocaleTimeString("en-US");

                                            return (
                                                <tr key={index}>
                                                    <td>{quest.text}</td>
                                                    <td>
                                                        {getRewardedInfo(rewardedQty, rewardType)}
                                                        {/* {rewardedQty} {rewardType.reward} */}
                                                    </td>
                                                    <td>{updateAtInLocale}</td>
                                                    <td>
                                                        <span>
                                                            <i
                                                                className="ri-delete-bin-line"
                                                                style={{
                                                                    fontSize: "2rem",
                                                                }}
                                                                onClick={async () => {
                                                                    let payload = {
                                                                        id,
                                                                        userId,
                                                                        questId,
                                                                    };
                                                                    if (
                                                                        !window.confirm(
                                                                            "Proceed To Delete"
                                                                        )
                                                                    ) {
                                                                        return;
                                                                    }
                                                                    let deleteOp =
                                                                        await deleteUserQuestsAsync(
                                                                            payload
                                                                        );

                                                                    if (!deleteOp.isError) {
                                                                        let currentUserQuests =
                                                                            userQuests.filter(
                                                                                (q) => q.id !== id
                                                                            );
                                                                        userQuestsSet(
                                                                            currentUserQuests
                                                                        );
                                                                    }
                                                                }}
                                                            ></i>
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserQuestsSearch;

function SearchUserQuestForm({ handleOnQuery }) {
    const initialValues = {
        user: "",
        type: Enums.WALLET,
    };

    const UserQuestsSearchSchema = object().shape({
        user: string().required("User is required"),
    });

    const getButtonState = (values) => {
        if (values.user.length === 0) {
            return true;
        }
        return false;
    };
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={UserQuestsSearchSchema}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);

                    const payload = {
                        type: fields.type,
                        user: fields.user,
                    };

                    await handleOnQuery(payload);
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm }) => (
                    <Form>
                        <div className="row">
                            {/* Type of social media account  */}
                            <div className="col-6 mb-3">
                                <label className="form-label">Type</label>
                                <Field name="type" as="select" className={"form-control"}>
                                    <option value={Enums.WALLET}>{Enums.WALLET}</option>
                                    <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                                    <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                                </Field>
                            </div>
                            {/* Username Input  */}
                            <div className="col-6 mb-3">
                                <label className="form-label">
                                    User (Wallet / Discord / Twitter)
                                </label>
                                <Field
                                    name="user"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.user && touched?.user ? " is-invalid" : "")
                                    }
                                />
                                <ErrorMessage
                                    name="user"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div
                                className={`col-12 mb-3 text-red-500 ${
                                    status ? "d-block" : "d-none"
                                }`}
                            >
                                <label className="form-label">API error: {status}</label>
                            </div>
                        </div>

                        <div className="mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                                disabled={getButtonState(values)}
                            >
                                Search
                            </button>
                            {/* <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => {
                                    setImageFile(null);
                                    resetForm();
                                    createRewardTypeSet({
                                        id: -1,
                                        reward: "",
                                        rewardPreview: "",
                                        isUpdating: false,
                                    });
                                }}
                            >
                                Cancel
                            </button> */}
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}
