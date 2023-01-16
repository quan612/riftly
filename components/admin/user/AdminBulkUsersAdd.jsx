import React, { useEffect, useState, useContext, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";

import { useAdminBulkUsersMutation } from "shared/HOC/user";
import Enums from "enums";
import { utils } from "ethers";
import { read, utils as excelUtils } from "xlsx";
import { Tooltip, useToast } from "@chakra-ui/react";

const initialValues = {
    wallet: "",
};

const AdminBulkUsersAdd = () => {
    const toast = useToast();
    const [newUsersData, isAdding, bulkUsersAsync] = useAdminBulkUsersMutation();
    const [usersArray, usersArraySet] = useState([]);
    const hiddenFileInput = useRef(null);

    const [inputFile, setInputFile] = useState(null);

    function handleOnLoadFile(e, setFieldValue) {
        if (!e.target.files[0]) {
            return;
        }
        const reader = new FileReader();

        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = function (onLoadEvent) {
            let data = onLoadEvent.target.result;
            let workbook = read(data, { type: "string", raw: true });

            let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]];

            let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
                let value = Object.values(r)[0];
                return { wallet: value, isValid: utils.isAddress(value) };
            });

            usersArraySet(arrayData);
        };
        setInputFile(e.target.files[0]);
    }
    return (
        <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
            // onSubmit={onSubmit}
        >
            {({ errors, status, touched, setFieldValue }) => (
                <Form>
                    <div className="row">
                        <div className="col-xxl-4 col-xl-4 col-lg-4 mb-3 ">
                            <label className="form-label me-3">Select Source File</label>
                            <a
                                href={`data:csv;charset=utf-8,${encodeURIComponent(getTemplate())}`}
                                download={`Wallet Bulk.csv`}
                                className="me-2 text-primary"
                            >
                                Template
                            </a>
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
                                accept="text/csv"
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
                            <h4 className="card-title mb-2 ">
                                Valid
                                <span className="text-success ms-1">
                                    {usersArray.filter((user) => user.isValid).length}
                                </span>{" "}
                                users, Invalid
                                <span className="text-danger ms-1 me-1">
                                    {usersArray.filter((user) => !user.isValid).length}
                                </span>
                                users{" "}
                                <Tooltip
                                    placement="top"
                                    label="Valid users would not be added if exists"
                                    aria-label="A tooltip"
                                    fontSize="md"
                                >
                                    <i
                                        className="ms-1 bi bi-info-circle"
                                        data-toggle="tooltip"
                                        title="Tooltip on top"
                                    ></i>
                                </Tooltip>
                            </h4>

                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive api-table">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Wallet</th>
                                                    <th>Is Valid</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersArray.map((row, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{usersArray[index].wallet}</td>
                                                            <td>
                                                                {usersArray[index].isValid && (
                                                                    <i
                                                                        className="ri-check-line"
                                                                        style={{
                                                                            fontSize: "2rem",
                                                                            color: "green",
                                                                        }}
                                                                    ></i>
                                                                )}
                                                                {!usersArray[index].isValid && (
                                                                    <span className="text-danger">
                                                                        Not a valid address
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
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

                                        if (createManyOp.isError) {
                                            toast({
                                                title: "Error",
                                                description: ` ${createManyOp.message}`,
                                                position: "bottom-right",
                                                status: "error",
                                                duration: 3000,
                                            });
                                        } else {
                                            toast({
                                                title: "Succeed",
                                                description: `Added ${createManyOp.count} users`,
                                                position: "bottom-right",
                                                status: "success",
                                                duration: 3000,
                                            });
                                        }
                                        setInputFile(null);
                                        usersArraySet([]);
                                    }}
                                >
                                    Bulk Add
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={async () => {
                                        setInputFile(null);
                                        usersArraySet([]);
                                    }}
                                >
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

const getTemplate = () => {
    const csvString = [
        ["wallet"],
        ["0xe90344F1526B04a59294d578e85a8a08D4fD6e0b"],
        ["0xe90344F1526B04a59294d578e85a8a08D4fD6e0c"],
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};
