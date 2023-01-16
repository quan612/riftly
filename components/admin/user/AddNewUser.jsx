import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";
import { useAdminUserMutation } from "shared/HOC/user";
import Enums from "enums";
import { Tooltip, useToast } from "@chakra-ui/react";

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
    type: Enums.WALLET,
    user: "",
};

const UserSchema = object().shape({
    user: string()
        .required()
        .test("valid address", "Wallet Address is not valid!", function () {
            if (Enums.DISCORD || Enums.TWITTER) return true;
            if (Enums.WALLET && utils.isAddress(this.parent.user)) return true;
            return false;
        }),
});

const AddNewUser = () => {
    const toast = useToast();
    const [avatar, setAvatar] = useState(null);

    useEffect(async () => {
        let ava = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(ava);
    }, []);

    const [newUserData, isAdding, addUserAsync] = useAdminUserMutation();

    const onSubmit = async (fields, { setStatus, resetForm, validate }) => {
        try {
            validate(fields);
            let res = await addUserAsync(fields);

            if (res.isError) {
                setStatus(`Catch error adding new ${fields.type} user: ${res.message}`);
            } else {
                let description;
                if (fields.type === Enums.DISCORD) {
                    description = `Added new discord user ${res.discordUserDiscriminator}`;
                }
                if (fields.type === Enums.TWITTER) {
                    description = `Added new twitter user ${res.twitterUserName}`;
                }
                if (fields.type === Enums.WALLET) {
                    description = `Added new user successfully`;
                }
                toast({
                    title: "Succeed",
                    description,
                    position: "bottom-right",
                    status: "success",
                    duration: 3000,
                });
                resetForm();
            }
        } catch (error) {}
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ errors, status, touched, isValid, dirty }) => {
                return (
                    <div className="row justify-content-center">
                        <div className="col-xxl-8 col-xl-8 col-lg-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <Form>
                                            <div className="row">
                                                <div className="col-xxl-12 col-xl-12 col-lg-1">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <img
                                                            className="me-3 rounded-circle me-0 me-sm-3"
                                                            src={avatar}
                                                            width="55"
                                                            height="55"
                                                            alt=""
                                                        />
                                                        <div className="media-body">
                                                            <h5 className="mb-0">Add new user</h5>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Type of social media account  */}
                                                <div className="col-xxl-4 col-xl-4 col-lg-4 mb-3">
                                                    <label className="form-label">Type</label>
                                                    <Field
                                                        name="type"
                                                        as="select"
                                                        className={"form-control"}
                                                    >
                                                        <option value={Enums.WALLET}>
                                                            {Enums.WALLET}
                                                        </option>
                                                        <option value={Enums.DISCORD}>
                                                            {Enums.DISCORD}
                                                        </option>
                                                        <option value={Enums.TWITTER}>
                                                            {Enums.TWITTER}
                                                        </option>
                                                    </Field>
                                                </div>

                                                {/* User Info */}
                                                <div className="col-xxl-8 col-xl-8 col-lg-8 mb-3">
                                                    <label className="form-label">
                                                        Wallet{" "}
                                                        <Tooltip
                                                            placement="top"
                                                            label="Checksum Web3 Wallet"
                                                            aria-label="A tooltip"
                                                            fontSize="md"
                                                        >
                                                            <i
                                                                className="ms-1 bi bi-info-circle"
                                                                data-toggle="tooltip"
                                                                title="Tooltip on top"
                                                            ></i>
                                                        </Tooltip>{" "}
                                                        / Discord Id{" "}
                                                        <Tooltip
                                                            placement="top"
                                                            label="Discord Unique Id (Not Discord Username or Discriminator)"
                                                            aria-label="A tooltip"
                                                            fontSize="md"
                                                        >
                                                            <i
                                                                className="ms-1 bi bi-info-circle"
                                                                data-toggle="tooltip"
                                                                title="Tooltip on top"
                                                            ></i>
                                                        </Tooltip>{" "}
                                                        / Twitter Handle{" "}
                                                        <Tooltip
                                                            placement="top"
                                                            label="Twitter Username (https://twitter.com/Whale_Drop)"
                                                            aria-label="A tooltip"
                                                            fontSize="md"
                                                        >
                                                            <i
                                                                className="ms-1 bi bi-info-circle"
                                                                data-toggle="tooltip"
                                                                title="Tooltip on top"
                                                            ></i>
                                                        </Tooltip>{" "}
                                                    </label>
                                                    <Field
                                                        name="user"
                                                        type="text"
                                                        className={
                                                            "form-control" +
                                                            (errors.user && touched.user
                                                                ? " is-invalid"
                                                                : "")
                                                        }
                                                    />
                                                </div>

                                                <div className="text-danger">
                                                    {errors && errors.user}
                                                </div>
                                                <div className="text-danger">
                                                    {status && status}
                                                </div>
                                            </div>

                                            <div className="col-3 mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary me-2 w-100"
                                                    disabled={isAdding || !dirty}
                                                >
                                                    {isAdding ? "Submitting..." : "Submit"}
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default AddNewUser;
