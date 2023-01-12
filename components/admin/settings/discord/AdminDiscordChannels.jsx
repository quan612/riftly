import React, { useEffect, useState, useCallback } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { useRouter } from "next/router";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { useAdminQuestSoftDelete, withAdminQuestQuery } from "shared/HOC/quest";
import { debounce } from "utils/";
import {
    useAdminDiscordChannelsMutation,
    useAdminDiscordChannelsQuery,
} from "@shared/HOC/settings";
import axios from "axios";

const AdminDiscordChannels = () => {
    let router = useRouter();

    const [discordChannels, isLoadingDiscordChannels] = useAdminDiscordChannelsQuery();
    const [data, isUpserting, upsertChannelAsync] = useAdminDiscordChannelsMutation();

    if (discordChannels?.length > 0) console.log(discordChannels[0]?.isEnabled);

    const handleOnChange = async (e, discord) => {
        e.preventDefault();
        if (discord.isEnabled !== e.target.checked) {
            const payload = { ...discord, isEnabled: e.target.checked, isCreated: false };
            console.log(payload);
            await upsertChannelAsync(payload);
        }
    };

    const debouncedChangeHandler = useCallback(
        debounce((e, discord) => handleOnChange(e, discord), 800),
        []
    );

    return (
        <div className="row">
            <div className="col-xxl-12">
                <h4 className="card-title mb-3">Create Channel</h4>
                <div className="card">
                    <div className="card-body">
                        <CreateDiscordChannel upsertChannelAsync={upsertChannelAsync} />
                    </div>
                </div>
            </div>
            <div className="col-xl-12">
                <h4 className="card-title mb-3">Current Channels</h4>
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive api-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Channel</th>
                                        <th>Channel Id</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discordChannels &&
                                        discordChannels.map((discord, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{discord.channel}</td>
                                                    <td>{discord.channelId}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                defaultChecked={
                                                                    discord.isEnabled ? true : false
                                                                }
                                                                onChange={(e) =>
                                                                    debouncedChangeHandler(
                                                                        e,
                                                                        discord
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            <i className="ri-delete-bin-line"></i>
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

export default AdminDiscordChannels;

const initialValues = {
    channel: "",
    channelId: "",
};

const CreateDiscordChannelSchema = object().shape({
    channel: string().required("Discord Channel is required"),
    channelId: string().required("Discord Channel Id required"),
});

function CreateDiscordChannel({ upsertChannelAsync }) {
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={CreateDiscordChannelSchema}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);
                    const payload = {
                        channel: fields.channel,
                        channelId: fields.channelId,
                        isEnabled: true,
                        isDeleted: false,
                        isCreated: true,
                    };
                    let upsertOp = await upsertChannelAsync(payload);

                    if (upsertOp.isError) {
                        setStatus(upsertOp.message);
                    } else {
                        resetForm();
                    }
                }}
            >
                {({ errors, status, touched }) => (
                    <Form>
                        <div className="row">
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Channel (#deep-sea-challenger)</label>
                                <Field
                                    name="channel"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.channel && touched?.channel ? " is-invalid" : "")
                                    }
                                />
                                <ErrorMessage
                                    name="channel"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-lg-6 mb-3">
                                <label className="form-label">Channel Id</label>
                                <Field
                                    name="channelId"
                                    type="text"
                                    className={
                                        "form-control" +
                                        (errors?.channelId && touched?.channelId
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="channelId"
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
                            <button type="submit" className="btn btn-primary mr-2">
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

function shortByText(a, b) {
    if (a.text?.toLowerCase() < b.text?.toLowerCase()) {
        return -1;
    }
    if (a.text?.toLowerCase() > b.text?.toLowerCase()) {
        return 1;
    }
    return 0;
}
