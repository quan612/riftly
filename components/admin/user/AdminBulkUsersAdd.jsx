import React, { useEffect, useState, useContext, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";

import { useAdminBulkUsersMutation } from "shared/HOC/user";
import Enums from "enums";

import { read, utils as excelUtils } from "xlsx";

const initialValues = {
    wallet: "",
};

const UserSchema = object().shape({
    // wallet: string()
    //     .required()
    //     .test("valid address", "Wallet Address is not valid!", function () {
    //         if (utils.isAddress(this.parent.wallet)) return true;
    //         else return false;
    //     }),
});

const AdminBulkUsersAdd = () => {
    const [newUsersData, isAdding, bulkUsersAsync] = useAdminBulkUsersMutation();
    const [usersArray, usersArraySet] = useState([]);
    const hiddenFileInput = useRef(null);

    const [inputFile, setInputFile] = useState(null);

    function handleOnLoadFile(e, setFieldValue) {
        const reader = new FileReader();

        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = function (onLoadEvent) {
            let data = onLoadEvent.target.result;
            let workbook = read(data, { type: "binary" });

            let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]];
            let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
                let value = Object.values(r)[0];

                return { wallet: value };
            });

            usersArraySet(arrayData);
        };
        setInputFile(e.target.files[0]);
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            validateOnBlur={true}
            validateOnChange={false}
            // onSubmit={onSubmit}
        >
            {({ errors, status, touched, setFieldValue }) => (
                <Form>
                    <div className="row">
                        <div className="col-xxl-4 col-xl-4 col-lg-4 mb-3">
                            <label className="form-label">Select Source File</label>
                            <br />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    hiddenFileInput.current.click();
                                }}
                                className="btn btn-primary me-2"
                            >
                                <div>
                                    <span>Choose File</span>
                                </div>
                            </button>
                            {inputFile && inputFile.name}
                            <input
                                type="file"
                                name="file"
                                accept="text/plain"
                                style={{ display: "none" }}
                                ref={hiddenFileInput}
                                onChange={(e) => handleOnLoadFile(e, setFieldValue)}
                            />
                        </div>
                        <div
                            className={`col-12 mb-3 text-red-500 ${status ? "d-block" : "d-none"}`}
                        >
                            <label className="form-label">API error: {status}</label>
                        </div>
                    </div>
                    {usersArray && usersArray.length > 0 && (
                        <>
                            <h4 className="card-title mb-3">Adding {usersArray.length} users</h4>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive api-table">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Wallet</th>
                                                    <th>Wallet</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersArray.map((row, index) => {
                                                    if (index % 2 === 0) {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{usersArray[index].wallet}</td>
                                                                <td>
                                                                    {index + 1 < usersArray.length
                                                                        ? usersArray[index + 1]
                                                                              .wallet
                                                                        : ""}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="btn btn-primary me-2"
                                    onClick={async () => {
                                        setInputFile(null);
                                        let payload = {
                                            usersArray,
                                        };

                                        let createManyOp = await bulkUsersAsync(payload);
                                        console.log(createManyOp);
                                    }}
                                >
                                    Bulk Add
                                </button>
                                <button type="button" className="btn btn-secondary me-2">
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default AdminBulkUsersAdd;
